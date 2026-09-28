import React from 'react';
import { ArrowRight, Clock, CheckCircle2, TrendingDown, Layers, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessVisualizer = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          Process Reengineering (BPR) Visualizer
        </h1>
        <p className="text-slate-500 text-sm mt-1">Comparing the traditional legacy process vs the new MAHA-SETU parallelized flow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AS-IS Process */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">As-Is (Legacy)</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-6">Sequential Government Process</h2>
          
          <div className="space-y-0 relative">
            <div className="absolute top-4 bottom-4 left-[27px] w-0.5 bg-slate-200"></div>
            
            {[
              { name: 'Company Registration', days: '15 Days', doc: 'MoA, AoA', color: 'slate' },
              { name: 'Wait for CIDCO Land Allotment', days: '45 Days', doc: 'DPR, Financials', color: 'red' },
              { name: 'Apply for MPCB Consent to Establish', days: '30 Days', doc: 'Project Report', color: 'amber' },
              { name: 'Apply for Fire NOC', days: '21 Days', doc: 'Building Plan', color: 'slate' },
              { name: 'Factory License', days: '15 Days', doc: 'Previous NOCs', color: 'slate' }
            ].map((step, i) => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-4 relative z-10 py-4">
                <div className={`w-14 h-14 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 ${
                  step.color === 'red' ? 'bg-red-100 text-red-600' : step.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <span className="font-bold">{i+1}</span>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-slate-700">{step.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {step.days}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> {step.doc}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-xl">
            <span className="text-sm font-bold text-slate-500">Total Estimated Time</span>
            <span className="text-xl font-bold text-slate-800">126 Days</span>
          </div>
        </div>


        {/* TO-BE Process */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm shadow-accent/20">To-Be (MAHA-SETU)</span>
          </div>
          <h2 className="text-lg font-bold text-primary-900 mb-6">Parallelized Smart Flow</h2>

          <div className="bg-white/60 p-6 rounded-xl border border-white space-y-6">
            
            <div className="flex justify-center">
              <div className="bg-accent/10 border border-accent/20 text-accent font-bold px-4 py-2 rounded-lg text-sm w-full text-center">
                Unified Single-Window Registration
              </div>
            </div>

            <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-slate-400 rotate-90"/></div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute top-0 left-1/2 w-px h-full bg-slate-300 -translate-x-1/2"></div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative z-10 text-center">
                <h4 className="font-bold text-slate-800 text-sm">Track A: Environmental</h4>
                <p className="text-xs text-slate-500 mt-1">MPCB CTE + Auto-generated reports via Copilot.</p>
                <div className="mt-3 text-xs font-bold text-accent bg-accent/10 inline-block px-2 py-1 rounded">30 Days (Parallel)</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative z-10 text-center">
                <h4 className="font-bold text-slate-800 text-sm">Track B: Infrastructure</h4>
                <p className="text-xs text-slate-500 mt-1">Land Allotment + Fire NOC running concurrently.</p>
                <div className="mt-3 text-xs font-bold text-accent bg-accent/10 inline-block px-2 py-1 rounded">45 Days (Parallel)</div>
              </motion.div>
            </div>

            <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-slate-400 rotate-90"/></div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="flex justify-center">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-4 py-3 rounded-lg text-sm w-full text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> QR-Verifiable Composite Factory License
              </div>
            </motion.div>

          </div>

          <div className="mt-6 pt-4 flex justify-between items-center bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <div>
              <span className="text-sm font-bold text-slate-600 block">Total Estimated Time</span>
              <span className="text-2xl font-bold text-primary-900">45 Days</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1 flex items-center gap-1 justify-end"><TrendingDown className="w-4 h-4"/> Efficiency Gained</span>
              <span className="text-xl font-bold text-emerald-600">- 81 Days</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessVisualizer;
