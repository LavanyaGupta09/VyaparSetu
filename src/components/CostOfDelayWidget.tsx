import React, { useState } from 'react';
import { Calculator, TrendingDown, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CostOfDelayWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [costs, setCosts] = useState({
    rent: 150000,
    salaries: 400000,
    loanInterest: 50000,
    otherFixed: 20000
  });

  const totalMonthly = Object.values(costs).reduce((a, b) => a + b, 0);
  const dailyCost = Math.round(totalMonthly / 30);
  
  return (
    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-white hover:from-red-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Calculator className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-red-900 text-sm">Cost of Delay Calculator</h3>
            <p className="text-xs text-red-700 mt-0.5">Estimated holding cost: ₹{dailyCost.toLocaleString()}/day</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-red-400" /> : <ChevronDown className="w-5 h-5 text-red-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-red-50">
              <div className="bg-red-50/50 p-3 rounded-lg flex items-start gap-2 mb-4 mt-4">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-800">
                  While you wait for approvals, your fixed costs continue. This calculator helps you measure the financial impact of government delays.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    Monthly Rent / Lease
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <input 
                      type="number" 
                      value={costs.rent}
                      onChange={(e) => setCosts({...costs, rent: parseInt(e.target.value) || 0})}
                      className="w-full pl-7 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-red-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    Core Team Salaries
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <input 
                      type="number" 
                      value={costs.salaries}
                      onChange={(e) => setCosts({...costs, salaries: parseInt(e.target.value) || 0})}
                      className="w-full pl-7 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-red-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    Loan Interest Component
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <input 
                      type="number" 
                      value={costs.loanInterest}
                      onChange={(e) => setCosts({...costs, loanInterest: parseInt(e.target.value) || 0})}
                      className="w-full pl-7 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-red-300"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-slate-400">Total Burn Rate</span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold">₹{dailyCost.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">per day</span>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-800 my-2"></div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span>A 30-day delay costs you ₹{totalMonthly.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
