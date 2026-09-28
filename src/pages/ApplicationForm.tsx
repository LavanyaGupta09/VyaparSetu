import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, UploadCloud, File, AlertCircle, Loader2, ArrowLeft, Send } from 'lucide-react';
import { aiService } from '../services/aiService';
import { fetchIfsc, validators } from '../services/publicApis';
import { useApplications } from '../hooks/useApplications';

const ApplicationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const applicationName = searchParams.get('name') || 'Business Application';
  
  const [step, setStep] = useState(1);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    businessName: 'Rohit Enterprises',
    industry: 'Food Processing',
    location: 'Pune, Maharashtra',
    investment: '4.2 Cr',
    employees: '35',
    pan: 'ABCDE1234F',
    gstin: '',
    ifsc: '',
    bankName: ''
  });
  
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscValid, setIfscValid] = useState(false);

  useEffect(() => {
    if (formData.ifsc.length >= 11 && validators.isValidIfsc(formData.ifsc)) {
      setIfscLoading(true);
      fetchIfsc(formData.ifsc)
        .then(res => {
          if (res.data.bank) {
            setFormData(prev => ({ ...prev, bankName: res.data.bank + ' - ' + res.data.branch }));
            setIfscValid(true);
          }
        })
        .catch(() => setIfscValid(false))
        .finally(() => setIfscLoading(false));
    } else {
      setIfscValid(false);
    }
  }, [formData.ifsc]);
  
  // Document state
  const [document, setDocument] = useState<{name: string, type: string, size: string} | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
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

  const runPreCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setScore(98);
      setIsChecking(false);
    }, 2000);
  };

  const { addApplication } = useApplications();

  const handleSubmit = async () => {
    const newApp = {
      name: applicationName,
      department: 'Various',
      status: 'Submitted',
      health: 'On Track',
      stage: 'Verification',
      slaDays: 30,
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      readinessScore: score || 0,
      pendingItems: [],
      predictiveDelay: null,
      costOfDelay: 0,
      industry: 'Other'
    };
    
    await addApplication(newApp as any);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-primary-900">{applicationName}</h1>
          <p className="text-slate-500 text-sm mt-1">Complete the steps below to submit your application securely.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Documents' },
            { num: 3, label: 'AI Pre-check' },
            { num: 4, label: 'Submit' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                step > s.num ? 'bg-emerald-500 border-emerald-500 text-white' : 
                step === s.num ? 'bg-accent border-accent text-white' : 
                'bg-white border-slate-200 text-slate-400'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-primary-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>We've pre-filled this information from your **VyaparSetu** profile. Please review and edit if necessary.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([key, val]) => {
                let isValid = false;
                if (key === 'pan') isValid = validators.isValidPan(val);
                if (key === 'ifsc') isValid = ifscValid;
                if (key === 'gstin') isValid = validators.isValidGstin(val);

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1 capitalize flex justify-between">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                      {isValid && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={val}
                        disabled={key === 'bankName'}
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent ${key === 'bankName' ? 'bg-slate-50 text-slate-500' : 'bg-white border-slate-200'}`}
                      />
                      {key === 'ifsc' && ifscLoading && <Loader2 className="w-4 h-4 text-accent animate-spin absolute right-3 top-1/2 -translate-y-1/2" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-primary-900">Required Documents for {applicationName}</h3>
            
            <div className="border border-slate-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-semibold text-slate-800">Primary Document</h4>
                  <p className="text-xs text-slate-500">Upload the relevant certification or site plan.</p>
                </div>
                {document ? (
                  <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-1 rounded-full">Pending</span>
                )}
              </div>
              
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
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center text-center py-6">
            {!score && !isChecking ? (
              <>
                <div className="w-20 h-20 bg-blue-50 text-accent rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900">Review & AI Pre-check</h3>
                  <p className="text-slate-500 max-w-md mx-auto mt-2">Before you submit, let Mitra AI analyze your application and documents to ensure there are no errors or missing fields.</p>
                </div>
                <button 
                  onClick={runPreCheck}
                  className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-accent/20 flex items-center gap-2"
                >
                  Run AI Pre-check
                </button>
              </>
            ) : isChecking ? (
              <>
                <Loader2 className="w-16 h-16 text-accent animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Analyzing Application...</h3>
                <p className="text-sm text-slate-500">Checking data consistency and document validity.</p>
              </>
            ) : (
              <>
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <path strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-3xl font-bold text-emerald-600">{score}%</div>
                </div>
                <h3 className="text-xl font-bold text-primary-900">Application Ready!</h3>
                <p className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium mt-2">
                  No issues found. Your application is highly likely to be approved on the first try.
                </p>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6 text-center">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Send className="w-10 h-10 ml-1" />
            </div>
            <h3 className="text-2xl font-bold text-primary-900">Ready to Submit</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Your {applicationName} application is verified and ready to be routed to the appropriate department.</p>
            
            <div className="bg-slate-50 rounded-xl p-4 text-left max-w-sm mx-auto border border-slate-200 mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-medium text-slate-800">{formData.businessName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Authority:</span>
                <span className="font-medium text-slate-800">Maharashtra State Dept</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fee:</span>
                <span className="font-medium text-slate-800">₹0 (Hackathon Waived)</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between">
          <button 
            onClick={handleBack} 
            disabled={step === 1 || isChecking}
            className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={isChecking || (step === 2 && !document) || (step === 3 && score === null)}
              className="px-6 py-2 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="px-8 py-2 bg-accent text-white rounded-lg font-bold hover:bg-accent-hover transition-colors shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Application
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ApplicationForm;
