import React, { useState, useEffect } from 'react';
import { Search, Filter, Bot, FileText, CheckCircle2, AlertCircle, RefreshCcw, Mail, Loader2, Download, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import { fetchGovDataStats } from '../services/publicApis';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, BarChart, XAxis, Tooltip, Bar } from 'recharts';
import { TiltCard, PressableButton3D, ScrollReveal3D, Icon3D } from '../components/3d';

const applications = [
  { id: 'APP-2026-892', company: 'Shree Foods Pvt Ltd', type: 'Pollution Consent', status: 'Pending Review', submittedAt: '2h ago', risk: 'Low' },
  { id: 'APP-2026-891', company: 'TechNova Manufacturing', type: 'Fire NOC', status: 'Pending Review', submittedAt: '5h ago', risk: 'High' },
  { id: 'APP-2026-885', company: 'Global Exports', type: 'Building Plan', status: 'Query Raised', submittedAt: '1d ago', risk: 'Medium' },
];

const OfficerDashboard = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [draftQuery, setDraftQuery] = useState('');
  const [govStats, setGovStats] = useState<any>(null);

  const { i18n } = useTranslation();

  useEffect(() => {
    fetchGovDataStats().then(setGovStats);
  }, []);

  const generateSummary = async () => {
    if (!selectedApp) return;
    setIsGenerating(true);
    setAiSummary('');
    setDraftQuery('');
    try {
      const summary = await aiService.officerCaseSummary(selectedApp, i18n.language);
      setAiSummary(summary);
    } catch (e) {
      setAiSummary('Failed to generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDraft = async () => {
    if (!selectedApp) return;
    setIsGenerating(true);
    setAiSummary('');
    setDraftQuery('');
    try {
      const draft = await aiService.draftQueryLetter(selectedApp, 'Site Plan missing architectural seal', i18n.language);
      setDraftQuery(draft);
    } catch (e) {
      setDraftQuery('Failed to generate draft.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Officer Copilot Dashboard <span className="bg-accent/10 text-accent text-xs px-2 py-1 rounded font-bold uppercase">Govt Mode</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">AI-assisted application processing and query generation.</p>
        
        {govStats && govStats.data && govStats.data.records && (
          <ScrollReveal3D className="mt-6">
            <TiltCard maxTilt={4}>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm h-full w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icon3D icon={BarChart2} bgFrom="#e0e7ff" bgTo="#c7d2fe" iconColor="#4f46e5" size="sm" />
                    Public Data Insights: MSMEs by District (Maharashtra)
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                    Source: {govStats.source === 'live' ? 'Open Government Data Platform India (data.gov.in)' : 'Demo Data (Fallback)'}
                    <br/>Fetched at: {new Date(govStats.fetchedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={govStats.data.records}>
                      <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                      />
                      <Bar dataKey="total_msme" name="Total MSMEs" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal3D>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox List — kept flat and dense for officer scanning speed */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search APP ID..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none" />
            </div>
            <button className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600"><Filter className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {applications.map(app => (
              <motion.div 
                key={app.id} 
                onClick={() => { setSelectedApp(app); setAiSummary(''); setDraftQuery(''); }}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${selectedApp?.id === app.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800 text-sm">{app.id}</span>
                  <span className="text-[10px] text-slate-400">{app.submittedAt}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium truncate mb-2">{app.company}</div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{app.type}</span>
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                    <AlertCircle className="w-3 h-3" /> {app.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Processing Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedApp ? (
            <>
              <ScrollReveal3D>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedApp.company}</h2>
                    <p className="text-slate-500 text-sm">Application: {selectedApp.id} • {selectedApp.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <PressableButton3D className="px-4 py-2 bg-emerald-50 text-emerald-700 font-medium text-sm rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </PressableButton3D>
                  </div>
                </div>
              </ScrollReveal3D>

              <ScrollReveal3D delay={0.1}>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-blue-100/50 flex items-center gap-2">
                    <Icon3D icon={Bot} bgFrom="#dbeafe" bgTo="#bfdbfe" iconColor="#3b82f6" size="sm" />
                    <h3 className="font-bold text-primary-900">Officer Copilot</h3>
                  </div>
                  
                  <div className="p-6 grid grid-cols-2 gap-4">
                    <TiltCard maxTilt={6}>
                      <button 
                        onClick={generateSummary}
                        disabled={isGenerating}
                        className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all text-left group disabled:opacity-50 w-full h-full"
                      >
                        <Icon3D icon={FileText} bgFrom="#dbeafe" bgTo="#bfdbfe" iconColor="#3b82f6" size="md" />
                        <h4 className="font-bold text-slate-800 text-sm mb-1 mt-3">Generate AI Case Summary</h4>
                        <p className="text-xs text-slate-500">Instantly summarize 50+ pages of project reports & forms.</p>
                      </button>
                    </TiltCard>

                    <TiltCard maxTilt={6}>
                      <button 
                        onClick={generateDraft}
                        disabled={isGenerating}
                        className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all text-left group disabled:opacity-50 w-full h-full"
                      >
                        <Icon3D icon={Mail} bgFrom="#fef3c7" bgTo="#fde68a" iconColor="#d97706" size="md" />
                        <h4 className="font-bold text-slate-800 text-sm mb-1 mt-3">Draft Deficiency Query</h4>
                        <p className="text-xs text-slate-500">Auto-draft a polite legal letter pointing out missing docs.</p>
                      </button>
                    </TiltCard>
                  </div>
                </div>
              </ScrollReveal3D>

              {/* Output Areas */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 flex flex-col items-center justify-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
                    <span className="text-sm">Copilot is analyzing documents...</span>
                  </motion.div>
                )}

                {aiSummary && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, rotateX: 10 }} 
                    animate={{ opacity: 1, y: 0, rotateX: 0 }} 
                    style={{ transformPerspective: 1200 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Bot className="w-4 h-4" /> Case Summary Result</h4>
                    <div className="prose prose-sm prose-slate max-w-none whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {aiSummary}
                    </div>
                  </motion.div>
                )}

                {draftQuery && !isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, rotateX: 10 }} 
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    style={{ transformPerspective: 1200 }}
                    className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm"
                  >
                    <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2"><Mail className="w-4 h-4" /> Draft Letter Generated</h4>
                    <div className="whitespace-pre-line bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-slate-800 font-serif">
                      {draftQuery}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <PressableButton3D className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 bg-white">Edit</PressableButton3D>
                      <PressableButton3D className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover flex items-center gap-2"><Mail className="w-4 h-4"/> Send to Applicant</PressableButton3D>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400">
              <FileText className="w-12 h-12 mb-3 text-slate-300" />
              <p>Select an application from the inbox to begin processing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
