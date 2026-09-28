import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Lock, AlertCircle, FileText } from 'lucide-react';

const ConsentLedger = () => {
  const [consents, setConsents] = useState([
    { id: 'doc_aadhaar', name: 'Aadhaar Verification', source: 'DigiLocker', authorizedTo: 'MPCB, MIDC', status: 'active', date: '2026-10-24' },
    { id: 'doc_pan', name: 'PAN Card (Entity)', source: 'Income Tax DB', authorizedTo: 'MPCB', status: 'active', date: '2026-10-24' },
    { id: 'doc_gst', name: 'GST Returns (Last 6M)', source: 'GSTN', authorizedTo: 'State Tax Dept', status: 'revoked', date: '2026-05-12' },
  ]);

  const toggleConsent = (id: string) => {
    setConsents(consents.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'revoked' : 'active' } : c));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-accent" />
          Privacy & Consent Ledger
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage exactly which government departments have access to your data via our DigiLocker adapter.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 text-sm">Data Minimization Enforced</h3>
          <p className="text-sm text-blue-700 mt-1">
            MAHA-SETU does not store your core identity documents. We fetch them via zero-knowledge APIs only when a specific officer requests them for a specific application, and only with your active consent below.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Document & Source</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Authorized Departments</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Last Accessed</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {consents.map(consent => (
              <tr key={consent.id} className={consent.status === 'revoked' ? 'bg-slate-50 opacity-60' : ''}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${consent.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{consent.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Key className="w-3 h-3" /> via {consent.source}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-slate-700">{consent.authorizedTo}</p>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {consent.date}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleConsent(consent.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                      consent.status === 'active' 
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {consent.status === 'active' ? <><EyeOff className="w-4 h-4" /> Revoke</> : <><Eye className="w-4 h-4" /> Grant</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsentLedger;
