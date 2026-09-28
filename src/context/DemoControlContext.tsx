import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { FastForward, CheckCircle2, ShieldAlert, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoControlContextType {
  timeOffsetDays: number;
  setTimeOffsetDays: (days: number) => void;
  triggerEvent: (event: string) => void;
}

const DemoControlContext = createContext<DemoControlContextType | undefined>(undefined);

export const DemoControlProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeOffsetDays, setTimeOffsetDays] = useState(0);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerEvent = (event: string) => {
    // In a real app, this would dispatch to a Redux store or similar
    if (event === 'approve_all') {
      import('../data/repositories').then(({ getApplicationRepository }) => {
        getApplicationRepository().then(repo => {
          repo.getApplications().then(apps => {
            apps.forEach(app => {
              repo.updateApplication(app.id, { status: 'Approved' });
            });
          });
        });
      });
    }
    if (event === 'whatsapp') {
      setShowWhatsApp(true);
      setTimeout(() => setShowWhatsApp(false), 8000);
    }
  };

  return (
    <DemoControlContext.Provider value={{ timeOffsetDays, setTimeOffsetDays, triggerEvent }}>
      {children}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-1/2 right-4 -translate-y-1/2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[9999] overflow-hidden text-slate-300"
          >
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                Hackathon Control Panel
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Time Machine</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setTimeOffsetDays(timeOffsetDays + 7)}
                    className="w-full flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                  >
                    <span className="flex items-center gap-2"><FastForward className="w-4 h-4 text-amber-500"/> +7 Days</span>
                    <span className="text-xs text-slate-500">Trigger warnings</span>
                  </button>
                  <button 
                    onClick={() => setTimeOffsetDays(timeOffsetDays + 30)}
                    className="w-full flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                  >
                    <span className="flex items-center gap-2"><FastForward className="w-4 h-4 text-red-500"/> +30 Days</span>
                    <span className="text-xs text-slate-500">Force SLA breach</span>
                  </button>
                  <button 
                    onClick={() => setTimeOffsetDays(0)}
                    className="w-full text-center p-2 rounded border border-slate-700 hover:bg-slate-800 text-xs text-slate-400 mt-2"
                  >
                    Reset Time ({timeOffsetDays}d offset)
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Simulations</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => triggerEvent('approve_all')}
                    className="w-full flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                  >
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Approve All</span>
                  </button>
                  <button 
                    onClick={() => triggerEvent('whatsapp')}
                    className="w-full flex items-center justify-between p-2 rounded bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                  >
                    <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-500"/> Simulate WhatsApp Alert</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-950 text-[10px] text-center text-slate-600 border-t border-slate-800">
              Press Ctrl+Shift+D to toggle this panel.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 20, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex"
          >
            <div className="w-2 bg-green-500 shrink-0"></div>
            <div className="p-4 w-full flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-800 text-sm">MAHA-SETU Alerts</h4>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ✅ <strong>APP-2026-892 (Pollution CTE)</strong> has been approved by the Officer.<br/><br/>
                  Download your digitally signed certificate: <a href="#" className="text-blue-500 underline">mahasetu.gov.in/cert/APP-2026-892</a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoControlContext.Provider>
  );
};

export const useDemoControl = () => {
  const context = useContext(DemoControlContext);
  if (context === undefined) {
    throw new Error('useDemoControl must be used within a DemoControlProvider');
  }
  return context;
};
