import React, { useState, useEffect } from 'react';
import { Info, Shield, AlertTriangle, FileText, ExternalLink, MessageSquareWarning, Loader2 } from 'lucide-react';
import type { RuleEvaluation } from '../engine/rulesEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import { useTranslation } from 'react-i18next';

interface ExplainPanelProps {
  evaluation: RuleEvaluation;
  isOpen: boolean;
  onClose: () => void;
}

const ExplainPanel: React.FC<ExplainPanelProps> = ({ evaluation, isOpen, onClose }) => {
  const [reported, setReported] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const { i18n } = useTranslation();

  const rule = evaluation?.matchedRules?.[0] || {};
  const status = rule.verificationStatus || 'Demo Rule';
  const confidence = status === 'Demo Rule' ? 'High' : 'Needs verification';

  useEffect(() => {
    if (isOpen && rule.sourceLabel) {
      setLoadingAi(true);
      aiService.explainRule(rule.sourceLabel, i18n.language)
        .then(res => setAiExplanation(res))
        .catch(() => setAiExplanation('Failed to load AI explanation.'))
        .finally(() => setLoadingAi(false));
    }
  }, [isOpen, rule.sourceLabel, i18n.language]);

  if (!isOpen) return null;

  const handleReport = () => {
    setReported(true);
    // In a real app, this would write to the feedbackReports store
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95, rotateX: -10 }}
          transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
          style={{ transformPerspective: 1200 }}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              Explainable AI Trace
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">&times;</button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Recommendation */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommendation</p>
              <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {evaluation.approval?.plainLanguageExplanation}
              </p>
            </div>

            {/* Rule Match Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rule Matched</p>
                <p className="text-sm font-medium text-slate-800">{rule.id} <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{rule.version}</span></p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  confidence === 'High' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {confidence === 'High' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {confidence}
                </span>
              </div>
            </div>

            {/* Inputs Used */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inputs Used from Profile</p>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 grid grid-cols-2 gap-3">
                {Object.entries(evaluation.inputsUsed).map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm font-semibold text-slate-800">{v?.toString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Label */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reference Source</p>
              <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                <FileText className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary-900">{rule.sourceLabel}</p>
                  <p className="text-xs text-slate-500 mt-1">Status: {rule.verificationStatus}</p>
                </div>
              </div>
            </div>

            {/* AI Deep Explanation */}
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2 flex items-center gap-1">
                ✨ AI Rule Explanation
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
                {loadingAi ? (
                  <span className="flex items-center gap-2 text-slate-500"><Loader2 className="w-4 h-4 animate-spin text-accent" /> Analyzing legal text...</span>
                ) : (
                  <p>{aiExplanation}</p>
                )}
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>AI guidance is informational. Final applicability is subject to the concerned authority and applicable law.</p>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
            <button onClick={handleReport} disabled={reported} className="text-xs font-medium text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors">
              <MessageSquareWarning className="w-4 h-4" /> 
              {reported ? 'Report Sent' : 'Report incorrect guidance'}
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-primary-900 text-white text-sm font-medium rounded-lg hover:bg-primary-800">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Internal icon dependency for self-containment
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default ExplainPanel;
