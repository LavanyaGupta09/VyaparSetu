import React from 'react';
import QRCode from 'react-qr-code';
import { Download, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const CertificateView = () => {
  const { id } = useParams();
  
  // Public URL that the QR points to
  const verificationUrl = `${window.location.origin}/verify/${id}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/dashboard" className="text-accent hover:underline text-sm font-medium">&larr; Back to Dashboard</Link>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-lg shadow-xl p-12 relative overflow-hidden">
        {/* Certificate Border/Watermark pattern */}
        <div className="absolute inset-0 border-[12px] border-double border-slate-100 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-slate-900" />
        </div>

        <div className="relative z-10 text-center space-y-8">
          <div className="flex flex-col items-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Seal_of_Maharashtra.svg" alt="Govt Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-3xl font-serif font-bold text-slate-900">Government of Maharashtra</h1>
            <h2 className="text-xl font-serif text-slate-600 mt-2">Maharashtra Pollution Control Board (MPCB)</h2>
          </div>

          <div className="border-y border-slate-200 py-6">
            <h3 className="text-2xl font-serif font-bold text-slate-800 uppercase tracking-widest mb-2">Consent to Establish</h3>
            <p className="text-sm font-mono text-slate-500">Certificate No: {id}</p>
          </div>

          <div className="text-left max-w-2xl mx-auto space-y-4 font-serif text-slate-700 leading-relaxed">
            <p>
              This is to certify that <strong>Shree Foods Pvt Ltd</strong>, located at Plot 42, MIDC Industrial Area, Pune, 
              has been granted the Consent to Establish under Section 25 of the Water (Prevention & Control of Pollution) Act, 1974.
            </p>
            <p>
              The consent is valid for a period of 5 years from the date of issue, subject to the conditions mentioned in the annexure.
            </p>
            <div className="flex justify-between items-end pt-8">
              <div>
                <p className="font-bold">Date of Issue: 24 Oct 2026</p>
                <p className="font-bold">Valid Until: 23 Oct 2031</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-16 border-b border-slate-300 mb-2 border-dashed"></div>
                <p className="text-sm">Authorized Signatory</p>
                <p className="text-xs text-slate-500">Digital Signature Valid</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 flex items-center gap-4 bg-white p-3 border border-slate-200 rounded-xl shadow-sm z-10">
          <QRCode value={verificationUrl} size={80} />
          <div className="text-xs text-slate-500 max-w-[150px]">
            <p className="font-bold text-slate-800 mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Scan to Verify</p>
            Scan this QR code to verify the authenticity of this certificate on the official MAHA-SETU portal.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
