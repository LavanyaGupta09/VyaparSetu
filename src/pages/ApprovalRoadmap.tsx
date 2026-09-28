import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Clock, AlertCircle, Lock, ArrowRight, Play, Info, Beaker, Calendar } from 'lucide-react';
import { evaluateProfile, buildDependencyGraph, type Profile, type RuleEvaluation } from '../engine/rulesEngine';
import ExplainPanel from '../components/ExplainPanel';
import { calculateSlaDeadline } from '../services/publicApis';
import { CostOfDelayWidget } from '../components/CostOfDelayWidget';
import { Link } from 'react-router-dom';

const ApprovalRoadmap = () => {
  const [evaluations, setEvaluations] = useState<RuleEvaluation[]>([]);
  const [graph, setGraph] = useState<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] });
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const mockProfile: Profile = {
    industry: 'Food Processing',
    investment: 42000000,
    employees: 35,
    hazardous: false,
    construction: true,
    location: 'Pune'
  };

  useEffect(() => {
    // 1. Evaluate the profile using the Rules Engine
    const evals = evaluateProfile(mockProfile);
    setEvaluations(evals);

    // 2. Build Dependency Graph
    const g = buildDependencyGraph(evals);
    setGraph(g);
    
    if (evals.length > 0) {
      setSelectedApproval(evals[0]);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Your Industrial Approval Roadmap</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
            Personalized for <span className="font-medium text-slate-700">Food Processing Unit • Pune • ₹4.2 Cr • 35 Employees</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/roadmap/what-if" className="flex items-center px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors shadow-sm">
            <Beaker className="w-4 h-4 mr-2" /> Try What-If
          </Link>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto min-h-[500px]">
          {evaluations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <p>No approvals required based on current rules.</p>
            </div>
          ) : (
            <div className="min-w-[600px] flex flex-col items-center">
              {/* Start Node */}
              <div className="flex justify-center mb-8">
                <div className="bg-primary-50 text-primary-700 px-6 py-2 rounded-full font-semibold border border-primary-100 text-sm">
                  START
                </div>
              </div>

              {/* Dynamic Path Mapping (Simplified Linear/Parallel Visual for Demo) */}
              <div className="flex flex-wrap justify-center gap-8 mb-8 relative w-full">
                {graph.nodes.map((node, i) => {
                  const ev = evaluations.find(e => e.approval.id === node.id);
                  const isSelected = selectedApproval?.approval.id === node.id;
                  
                  return (
                    <div key={node.id} className="flex flex-col items-center relative" onClick={() => setSelectedApproval(ev)}>
                      {i > 0 && <div className="absolute w-8 h-px bg-slate-200 top-1/2 -left-8"></div>}
                      <div className={`border-2 rounded-xl p-4 w-64 shadow-sm flex flex-col items-center relative z-10 cursor-pointer transition-all ${
                        isSelected ? 'border-accent ring-4 ring-accent/10 transform scale-105' : 'border-slate-200 hover:border-accent/50'
                      }`}>
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-slate-400'}`} />
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm text-center">{node.name}</h3>
                        <span className="text-xs font-medium text-slate-500 mt-1.5 px-2 py-0.5 bg-slate-50 rounded">
                          {node.department}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* End Node */}
              <div className="flex justify-center mt-8">
                <div className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full font-semibold border border-emerald-100 text-sm">
                  READY FOR OPERATIONS
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <CostOfDelayWidget />
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary-900">Approval Details</h3>
              <span className="p-1.5 bg-blue-50 text-accent rounded-lg"><Info className="w-4 h-4" /></span>
            </div>
            
            {selectedApproval ? (
              <>
                <div className="mb-6 p-4 border border-accent/20 bg-blue-50/50 rounded-xl">
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <span className="font-semibold text-sm">{selectedApproval.approval.name}</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-slate-500 block mb-1">Authority</span>
                    <span className="font-medium text-slate-800">{selectedApproval.approval.authority}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Why Required (AI Explanation)</span>
                    <span className="text-slate-700">{selectedApproval.approval.plainLanguageExplanation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Estimated Timeline</span>
                    <span className="font-medium text-slate-800">
                      {selectedApproval.approval.estimatedTimelineDays[0]}-{selectedApproval.approval.estimatedTimelineDays[1]} days (SLA: {selectedApproval.approval.slaDays} Working Days)
                    </span>
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg mt-2">
                      <p className="text-xs font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        Deadline if submitted today: {calculateSlaDeadline(new Date(), selectedApproval.approval.slaDays).deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Computed using {calculateSlaDeadline(new Date(), selectedApproval.approval.slaDays).source}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-2">Documents Required</span>
                    <ul className="space-y-2">
                      {selectedApproval.approval.documentsRequired.map((doc: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-700 capitalize">
                          <CheckCircle2 className="w-4 h-4 text-slate-400" /> {doc.replace(/_/g, ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tracing Info for Demo */}
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <button 
                      onClick={() => setIsExplainOpen(true)}
                      className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-accent hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-accent" />
                        <span className="font-medium text-slate-700 group-hover:text-accent">Why am I seeing this?</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Select an approval to view details.</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm p-6">
            <h3 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
              <Play className="w-4 h-4 text-accent fill-accent" /> Parallel Processing
            </h3>
            <p className="text-sm text-slate-600 mb-4">You saved potential waiting time by applying for these approvals simultaneously.</p>
            <div className="bg-white/60 rounded-xl p-3 text-sm">
              <div className="flex justify-between items-center text-primary-900 font-medium mb-1">
                <span>Estimated Time Saved</span>
                <span className="text-emerald-600 font-bold">~2-4 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedApproval && (
        <ExplainPanel 
          evaluation={selectedApproval}
          isOpen={isExplainOpen}
          onClose={() => setIsExplainOpen(false)}
        />
      )}
    </div>
  );
};

export default ApprovalRoadmap;
