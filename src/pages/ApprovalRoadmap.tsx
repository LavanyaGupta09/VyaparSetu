import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Clock, AlertCircle, Lock, ArrowRight, Play, Info, Beaker, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { evaluateProfile, buildDependencyGraph, type Profile, type RuleEvaluation } from '../engine/rulesEngine';
import ExplainPanel from '../components/ExplainPanel';
import { calculateSlaDeadline } from '../services/publicApis';
import { CostOfDelayWidget } from '../components/CostOfDelayWidget';
import { Link } from 'react-router-dom';
import { TiltCard, PressableButton3D, ScrollReveal3D, Icon3D, DependencyGraph3D } from '../components/3d';

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
    const evals = evaluateProfile(mockProfile);
    setEvaluations(evals);
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
          <PressableButton3D className="flex items-center px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors">
            <Link to="/roadmap/what-if" className="flex items-center">
              <Beaker className="w-4 h-4 mr-2" /> Try What-If
            </Link>
          </PressableButton3D>
          <PressableButton3D className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Download
          </PressableButton3D>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScrollReveal3D className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-x-auto min-h-[500px] relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            
            {evaluations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 relative z-10">
                <p>No approvals required based on current rules.</p>
              </div>
            ) : (
              <div className="h-full w-full relative z-10 p-2">
                <DependencyGraph3D 
                  nodes={graph.nodes}
                  edges={graph.edges}
                  onNodeSelect={(id) => {
                    const ev = evaluations.find(e => e.approval.id === id);
                    setSelectedApproval(ev);
                  }}
                  selectedId={selectedApproval?.approval.id || null}
                />
              </div>
            )}
          </div>
        </ScrollReveal3D>

        <div className="space-y-6">
          <ScrollReveal3D delay={0.15}>
            <CostOfDelayWidget />
          </ScrollReveal3D>
          
          <ScrollReveal3D delay={0.25}>
            <TiltCard maxTilt={6}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-primary-900">Approval Details</h3>
                  <Icon3D icon={Info} bgFrom="#dbeafe" bgTo="#bfdbfe" iconColor="#3b82f6" size="sm" />
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
                      
                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <PressableButton3D 
                          onClick={() => setIsExplainOpen(true)}
                          className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-accent hover:bg-blue-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-accent" />
                            <span className="font-medium text-slate-700 group-hover:text-accent">Why am I seeing this?</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent" />
                        </PressableButton3D>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8">Select an approval to view details.</p>
                )}
              </div>
            </TiltCard>
          </ScrollReveal3D>

          <ScrollReveal3D delay={0.35}>
            <TiltCard maxTilt={6}>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
                  <Play className="w-4 h-4 text-accent fill-accent" /> Parallel Processing
                </h3>
                <p className="text-sm text-slate-600 mb-4">You saved potential waiting time by applying for these approvals simultaneously.</p>
                <div className="bg-white/60 rounded-xl p-3 text-sm">
                  <div className="flex justify-between items-center text-primary-900 font-medium mb-1">
                    <span>Estimated Time Saved</span>
                    <span className="text-emerald-600 font-bold text-embossed">~2-4 weeks</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal3D>
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
