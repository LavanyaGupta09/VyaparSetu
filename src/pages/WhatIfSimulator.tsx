import React, { useState, useMemo } from 'react';
import { Shield, ArrowLeft, Sliders, Save, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { evaluateProfile, type Profile } from '../engine/rulesEngine';
import ExplainPanel from '../components/ExplainPanel';
import { Link } from 'react-router-dom';

const baseProfile: Profile = {
  industry: 'Food Processing',
  investment: 42000000,
  employees: 15,
  hazardous: false,
  construction: false,
  location: 'Pune'
};

const WhatIfSimulator = () => {
  const [scenario, setScenario] = useState<Profile>({ ...baseProfile });
  const [explainEval, setExplainEval] = useState<any>(null);

  // Evaluate baseline vs scenario
  const baseEvaluations = useMemo(() => evaluateProfile(baseProfile), []);
  const scenarioEvaluations = useMemo(() => evaluateProfile(scenario), [scenario]);

  const baseApprovalIds = baseEvaluations.map(e => e.approval.id);
  const scenarioApprovalIds = scenarioEvaluations.map(e => e.approval.id);

  const addedApprovals = scenarioEvaluations.filter(e => !baseApprovalIds.includes(e.approval.id));
  const removedApprovals = baseEvaluations.filter(e => !scenarioApprovalIds.includes(e.approval.id));
  const unchangedApprovals = scenarioEvaluations.filter(e => baseApprovalIds.includes(e.approval.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/roadmap" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary-900">What-If Simulator</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Scenario estimate based on prototype rules. Authority verification required.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-slate-800">Scenario Variables</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                Employees <span>{scenario.employees}</span>
              </label>
              <input 
                type="range" min="1" max="500" 
                value={scenario.employees} 
                onChange={(e) => setScenario({...scenario, employees: parseInt(e.target.value)})}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                Investment (₹) <span>{(scenario.investment / 10000000).toFixed(1)} Cr</span>
              </label>
              <input 
                type="range" min="1000000" max="1000000000" step="1000000"
                value={scenario.investment} 
                onChange={(e) => setScenario({...scenario, investment: parseInt(e.target.value)})}
                className="w-full accent-accent"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Involves new construction?</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={scenario.construction} onChange={(e) => setScenario({...scenario, construction: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Hazardous materials?</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={scenario.hazardous} onChange={(e) => setScenario({...scenario, hazardous: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> Apply to my profile
              </button>
            </div>
          </div>
        </div>

        {/* Live Graph & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Approvals Added</p>
                <p className="text-2xl font-bold text-emerald-700">+{addedApprovals.length}</p>
              </div>
              <Shield className="w-8 h-8 text-emerald-200" />
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Approvals Removed</p>
                <p className="text-2xl font-bold text-red-700">-{removedApprovals.length}</p>
              </div>
              <Shield className="w-8 h-8 text-red-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-primary-900 mb-6">Live Scenario Roadmap</h3>
            
            <div className="space-y-3">
              <AnimatePresence>
                {/* Added */}
                {addedApprovals.map(ev => (
                  <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    key={ev.approval.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">New Requirement</span>
                        <h4 className="font-bold text-slate-800">{ev.approval.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500">{ev.reason}</p>
                    </div>
                    <button onClick={() => setExplainEval(ev)} className="p-2 text-accent hover:bg-emerald-100 rounded-lg transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}

                {/* Unchanged */}
                {unchangedApprovals.map(ev => (
                  <motion.div layout key={ev.approval.id} className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">{ev.approval.name}</h4>
                      <p className="text-xs text-slate-500">{ev.approval.authority}</p>
                    </div>
                    <button onClick={() => setExplainEval(ev)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-accent rounded-lg transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}

                {/* Removed */}
                {removedApprovals.map(ev => (
                  <motion.div layout initial={{ opacity: 1 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                    key={ev.approval.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center opacity-60"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-slate-300 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">No longer applicable</span>
                        <h4 className="font-bold text-slate-500 line-through">{ev.approval.name}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {explainEval && (
        <ExplainPanel 
          evaluation={explainEval} 
          isOpen={!!explainEval} 
          onClose={() => setExplainEval(null)} 
        />
      )}
    </div>
  );
};

export default WhatIfSimulator;
