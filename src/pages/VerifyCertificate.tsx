import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle, XCircle, Search, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Simulate API validation delay
    setTimeout(() => {
      setIsValidating(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MAHA-SETU</h1>
        <p className="text-slate-500 text-sm">Official Document Verification Portal</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
        {isValidating ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500">
            <Search className="w-12 h-12 animate-pulse text-accent mb-4" />
            <h2 className="text-lg font-medium text-slate-800 mb-2">Verifying Certificate...</h2>
            <p className="text-sm text-center">Checking cryptographic signatures against the MAHA-SETU registry for ID: {id}</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-emerald-50 border-b border-emerald-100 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-1">Valid Certificate</h2>
              <p className="text-emerald-600 text-sm font-medium">Verified by Government of Maharashtra</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Document Type</p>
                  <p className="text-sm font-bold text-slate-800">Pollution Consent to Establish (CTE)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Entity Name</p>
                  <p className="text-sm font-semibold text-slate-800">Shree Foods Pvt Ltd</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Certificate No.</p>
                  <p className="text-sm font-mono text-slate-800">{id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-slate-800">24 Oct 2026</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className="text-sm font-semibold text-emerald-600">Active</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <Link to="/" className="text-sm font-medium text-accent hover:underline">
                Return to MAHA-SETU Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs">
        <ShieldCheck className="w-4 h-4" />
        Secured by MAHA-SETU Blockchain Registry
      </div>
    </div>
  );
};

export default VerifyCertificate;
