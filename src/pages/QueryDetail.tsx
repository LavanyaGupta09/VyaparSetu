import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, File, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const QueryDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryName = searchParams.get('name') || 'Reply to queries on Pollution CTE';
  
  const [document, setDocument] = useState<{name: string, type: string, size: string} | null>(null);
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocument({
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Response Submitted</h2>
        <p className="text-slate-500">Your response has been forwarded to the respective department.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Query Detail</h1>
          <p className="text-slate-500 text-sm mt-1">Resolve issues raised by the department.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900">{queryName}</h3>
            <p className="text-amber-700 text-sm mt-1">
              <strong>Raised by:</strong> Pollution Control Board (MPCB) <br/>
              <strong>Deadline:</strong> 2 Days Left <br/>
            </p>
            <div className="mt-4 p-4 bg-white/60 rounded-lg text-amber-900 text-sm">
              "The attached site plan does not clearly demarcate the effluent treatment plant area. Please provide an updated plan with exact dimensions and boundary lines."
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Your Response Text (Optional)</label>
          <textarea 
            className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-accent min-h-[100px]"
            placeholder="Explain your resolution here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Supporting Documents</label>
          {!document ? (
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
              <input type="file" id="docUpload" className="hidden" onChange={handleUpload} />
              <label htmlFor="docUpload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-accent rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700">Click to upload document</span>
                <span className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
              </label>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-slate-400" />
                <div>
                  <p className="font-medium text-sm text-slate-800">{document.name}</p>
                  <p className="text-xs text-slate-500">{document.size}</p>
                </div>
              </div>
              <button onClick={() => setDocument(null)} className="text-xs font-medium text-red-500 hover:underline">Remove</button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={!response && !document}
            className="px-6 py-2 bg-accent text-white rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Submit Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryDetail;
