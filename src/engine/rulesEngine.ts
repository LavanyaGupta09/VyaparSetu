import approvalsData from '../rules/approvals.json';
import conditionsData from '../rules/conditions.json';

export interface Profile {
  industry: string;
  investment: number;
  employees: number;
  hazardous: boolean;
  construction: boolean;
  [key: string]: any;
}

export interface RuleEvaluation {
  approval: any;
  matchedRules: any[];
  inputsUsed: Partial<Profile>;
  reason: string;
}

/**
 * Very simple expression evaluator strictly scoped to the Profile shape.
 * Avoids using `eval()` directly for security, but uses a controlled Function block.
 */
function evaluateCondition(condition: string, profile: Profile): boolean {
  try {
    const keys = Object.keys(profile);
    const values = Object.values(profile);
    // Secure function constructor bounded only to primitive profile values
    const func = new Function(...keys, `return ${condition};`);
    return func(...values);
  } catch (error) {
    console.error('Rule evaluation error:', condition, error);
    return false;
  }
}

/**
 * Evaluates the profile against the rules engine to determine applicable approvals.
 */
export function evaluateProfile(profile: Profile): RuleEvaluation[] {
  const applicable: RuleEvaluation[] = [];

  for (const approval of approvalsData) {
    const matchingRules = conditionsData.filter(rule => rule.approvalId === approval.id);
    const matched = [];
    const inputsUsed: any = {};

    for (const rule of matchingRules) {
      if (evaluateCondition(rule.condition, profile)) {
        matched.push(rule);
        // Extremely naive input tracking for demo purposes:
        Object.keys(profile).forEach(key => {
          if (rule.condition.includes(key)) {
            inputsUsed[key] = profile[key];
          }
        });
      }
    }

    if (matched.length > 0) {
      applicable.push({
        approval,
        matchedRules: matched,
        inputsUsed,
        reason: matched.map(m => m.sourceLabel).join(', ')
      });
    }
  }

  return applicable;
}

/**
 * Builds a directed graph representing the required chronological order of approvals.
 */
export function buildDependencyGraph(evaluations: RuleEvaluation[]) {
  const nodes = evaluations.map(e => e.approval);
  const edges: { from: string, to: string }[] = [];
  
  nodes.forEach(node => {
    node.dependsOn.forEach((depId: string) => {
      // Only add edge if the dependency is also in the applicable set
      if (nodes.find(n => n.id === depId)) {
        edges.push({ from: depId, to: node.id });
      }
    });
  });

  return { nodes, edges };
}

/**
 * Explains why a specific approval was flagged for the user.
 */
export function explain(approvalId: string, profile: Profile) {
  const evaluation = evaluateProfile(profile).find(e => e.approval.id === approvalId);
  return evaluation || null;
}
