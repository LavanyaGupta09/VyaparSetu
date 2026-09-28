import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Utensils, Scissors, Monitor, Pill, Truck, Sun, Users, ArrowRight, ArrowLeft, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { fetchPincode, validators } from '../services/publicApis';

const industryTypes = [
  { id: 'manufacturing', name: 'Manufacturing', icon: Building2 },
  { id: 'food', name: 'Food Processing', icon: Utensils },
  { id: 'textile', name: 'Textile', icon: Scissors },
  { id: 'it', name: 'IT / ITES', icon: Monitor },
  { id: 'pharma', name: 'Pharmaceutical', icon: Pill },
  { id: 'logistics', name: 'Logistics', icon: Truck },
  { id: 'renewable', name: 'Renewable Energy', icon: Sun },
  { id: 'msme', name: 'MSME', icon: Users },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [pincode, setPincode] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pinSource, setPinSource] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (pincode.length === 6 && validators.isValidPincode(pincode)) {
      setPinLoading(true);
      setPinError('');
      fetchPincode(pincode)
        .then(res => {
          if (res.data.state !== 'Maharashtra') {
            setPinError('Note: MAHA-SETU is for Maharashtra state only.');
          } else {
            setDistrict(res.data.district);
            setStateName(res.data.state);
            setPinSource(`Source: ${res.source}`);
          }
        })
        .catch(err => setPinError('Invalid pincode or service unavailable'))
        .finally(() => setPinLoading(false));
    } else if (pincode.length > 0 && pincode.length < 6) {
      setPinError('');
      setPinSource('');
    }
  }, [pincode]);

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else navigate('/dashboard');
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6">
        <span className="text-xl font-bold text-primary-900 tracking-tight">MAHA-SETU</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent transition-all duration-300 -z-10 rounded-full"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                    i < step ? 'bg-accent border-accent text-white' : 
                    i === step ? 'bg-white border-accent text-accent' : 
                    'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
              <span>Industry</span>
              <span>Location</span>
              <span>Scale</span>
              <span>Environment</span>
              <span>Stage</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-primary-900 mb-2">What are you setting up?</h2>
                    <p className="text-slate-500 mb-6">Select the type of industry</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {industryTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedIndustry === type.id;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedIndustry(type.id)}
                            className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                              isSelected 
                                ? 'border-accent bg-accent/5 text-accent' 
                                : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-8 h-8 ${isSelected ? 'text-accent' : 'text-slate-400'}`} />
                            <span className="font-medium text-sm text-center">{type.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-primary-900 mb-2">Where is it located?</h2>
                    <p className="text-slate-500 mb-6">Enter district and specific location details</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pincode (6 digits)</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="e.g. 411057" 
                            className={`w-full rounded-lg border p-3 pl-10 focus:ring-accent focus:border-accent ${pinError ? 'border-red-300' : 'border-slate-200'}`} 
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          {pinLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />}
                        </div>
                        {pinError && <p className="text-red-500 text-xs mt-1">{pinError}</p>}
                        {pinSource && !pinError && <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Validated ({pinSource})</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                          <input type="text" value={stateName} disabled className="w-full rounded-lg border-slate-200 border p-3 bg-slate-50 text-slate-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                          <input type="text" value={district} disabled className="w-full rounded-lg border-slate-200 border p-3 bg-slate-50 text-slate-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Industrial Area / MIDC / Specific Address</label>
                        <input type="text" placeholder="e.g. Hinjewadi Phase 1" className="w-full rounded-lg border-slate-200 border p-3 focus:ring-accent focus:border-accent" />
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-primary-900 mb-2">What is the scale of the unit?</h2>
                    <div className="space-y-4 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Investment</label>
                        <select className="w-full rounded-lg border-slate-200 border p-3">
                          <option>Less than ₹1 Cr</option>
                          <option>₹1 Cr - ₹10 Cr</option>
                          <option>₹10 Cr - ₹50 Cr</option>
                          <option>More than ₹50 Cr</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expected Employees</label>
                        <input type="number" placeholder="e.g. 35" className="w-full rounded-lg border-slate-200 border p-3" />
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-primary-900 mb-2">Environmental Factors</h2>
                    <p className="text-slate-500 mb-6">Select all that apply</p>
                    <div className="space-y-3">
                      {['Generates hazardous waste', 'High water consumption', 'Involves construction', 'Requires heavy machinery'].map(factor => (
                        <label key={factor} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                          <input type="checkbox" className="h-5 w-5 text-accent rounded border-slate-300 focus:ring-accent" />
                          <span className="text-slate-700 font-medium">{factor}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-primary-900 mb-2">Current Business Stage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {['Planning Phase', 'Land Acquired', 'Under Construction', 'Setup Complete', 'Operational', 'Expansion'].map(stage => (
                        <button key={stage} className="p-4 border rounded-lg text-left hover:border-accent hover:bg-accent/5 font-medium text-slate-700 transition-colors">
                          {stage}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="bg-slate-50 p-6 flex justify-between border-t border-slate-100">
              <button 
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium bg-primary-900 text-white hover:bg-primary-800 transition-colors"
              >
                {step === 5 ? 'Generate Roadmap' : 'Next'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
