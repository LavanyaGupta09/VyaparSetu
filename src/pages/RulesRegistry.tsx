import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2, AlertTriangle, Search, Filter, Edit3, Plus, ArrowRight } from 'lucide-react';
import conditionsData from '../rules/conditions.json';

const RulesRegistry = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Rules Registry</h1>
          <p className="text-slate-500 text-sm mt-1">
            Data-driven rules engine powering all MAHA-SETU recommendations.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Rule
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search rules, acts, or IDs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-accent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Rule ID & Version</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Target Approval</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Condition Expression</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Source / Act</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {conditionsData.filter(r => r.sourceLabel.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase())).map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900 text-sm">{rule.id}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{rule.version}</span>
                      From {rule.effectiveFrom}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-primary-900">{rule.approvalId}</div>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-slate-100 text-pink-600 px-2 py-1 rounded">
                      {rule.condition}
                    </code>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {rule.sourceLabel}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      rule.verificationStatus === 'Demo Rule' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {rule.verificationStatus === 'Demo Rule' ? <Shield className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {rule.verificationStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-2 text-slate-400 hover:text-accent transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RulesRegistry;
