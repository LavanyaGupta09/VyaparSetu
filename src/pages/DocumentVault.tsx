import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, Eye, Search, Filter, Loader2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import { supabase } from '../lib/supabase';
import { TiltCard, PressableButton3D, ScrollReveal3D, Icon3D, GlassPanel } from '../components/3d';

const DocumentVault = () => {
  const [documents, setDocuments] = useState([
    { name: "Project Report.pdf", type: "PDF", extracted: true, verified: true, review: false, missing: false, date: "10 Oct 2025", data: {} },
    { name: "PAN Card.pdf", type: "PDF", extracted: true, verified: true, review: false, missing: false, date: "10 Oct 2025", data: {} },
    { name: "Site Plan.pdf", type: "PDF", extracted: false, verified: false, review: true, missing: false, date: "12 Oct 2025", data: {} },
    { name: "Pollution Consent.pdf", type: "PDF", extracted: false, verified: false, review: false, missing: true, date: "-", data: {} },
  ]);
  
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(87);

  // File Upload & OCR states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [currentFile, setCurrentFile] = useState<{name: string, type: string, path?: string} | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);
    
    let uploadedPath = '';
    
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const fileName = `${Date.now()}_${file.name}`;
          const filePath = `${session.user.id}/${fileName}`;
          
          const { error: uploadErr } = await supabase.storage
            .from('documents')
            .upload(filePath, file);
            
          if (uploadErr) {
            console.error('Storage upload error:', uploadErr);
            throw new Error('Failed to upload to secure storage');
          }
          uploadedPath = filePath;
        }
      }
    } catch (err: any) {
      setUploadError(err.message);
      setIsUploading(false);
      return;
    }

    setCurrentFile({ name: file.name, type: file.type, path: uploadedPath });

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        // The secure OCR extraction via backend -> Groq
        const result = await aiService.extractDocumentData(base64, file.type);
        
        if (result.success) {
          setExtractedData(result.extractedFields || { message: "No structured fields found. Verify raw text." });
          setShowModal(true);
        } else {
          setUploadError('Failed to extract data.');
        }
      } catch (err: any) {
        setUploadError(err.message || 'OCR processing failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveData = () => {
    if (!currentFile) return;

    const newDoc = {
      name: currentFile.name,
      type: currentFile.type.includes('pdf') ? 'PDF' : 'IMAGE',
      extracted: true,
      verified: true,
      review: false,
      missing: false,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      data: extractedData,
      path: currentFile.path
    };

    // Check if replacing missing document or adding new
    const existingIndex = documents.findIndex(d => d.name === currentFile.name || (d.missing && d.name.includes('Pollution')));
    
    if (existingIndex >= 0) {
      const newDocs = [...documents];
      newDocs[existingIndex] = { ...newDocs[existingIndex], ...newDoc, name: newDocs[existingIndex].name };
      setDocuments(newDocs);
    } else {
      setDocuments([newDoc, ...documents]);
    }

    setShowModal(false);
    setExtractedData(null);
    setCurrentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // Automatically recalculate readiness score based on new verified docs
    setScore(prev => Math.min(prev + 5, 100));
  };

  const runAiPreCheck = async () => {
    setIsChecking(true);
    try {
      const sitePlan = documents.find(d => d.name === "Site Plan.pdf");
      const result = await aiService.validateDocument("Site Plan", "PDF", sitePlan?.data);
      
      setDocuments(docs => docs.map(d => {
        if (d.name === "Site Plan.pdf") {
          // AI service returns the validation object directly now, or might return { validation: ... } if backend changed. 
          // Let's handle both safely.
          const val = result.validation ? result.validation : result;
          return { ...d, extracted: val.extracted, verified: val.verified, review: !val.verified };
        }
        return d;
      }));
      const scoreObj = result.validation ? result.validation : result;
      setScore(scoreObj.score || 95);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Document Vault</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and verify your documents with AI-powered OCR extraction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.jpg,.jpeg,.png" 
            className="hidden" 
          />
          
          <TiltCard maxTilt={4}>
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`bg-white border-2 border-slate-200 rounded-2xl border-dashed p-8 flex flex-col items-center justify-center transition-colors text-center h-full ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:border-accent/50 cursor-pointer'}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center text-accent">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <h3 className="text-lg font-bold mb-1">Running OCR & AI Extraction...</h3>
                  <p className="text-sm">Please wait while we securely process your document.</p>
                </div>
              ) : (
                <>
                  <Icon3D icon={UploadCloud} bgFrom="#dbeafe" bgTo="#bfdbfe" iconColor="#3b82f6" size="lg" className="mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Drag & drop files here or click to upload</h3>
                  <p className="text-sm text-slate-500 mb-4">Supported: PDF, JPG, PNG up to 5MB</p>
                  <PressableButton3D className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium">
                    Select Files
                  </PressableButton3D>
                </>
              )}
              
              {uploadError && (
                <div className="mt-4 text-red-500 text-sm font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4" /> {uploadError}
                </div>
              )}
            </div>
          </TiltCard>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search documents..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-accent w-64 bg-white" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="p-4 font-medium">Document Name</th>
                    <th className="p-4 font-medium">Date Uploaded</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-slate-400" />
                          <span className="font-medium text-slate-800 text-sm">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500">{doc.date}</td>
                      <td className="p-4">
                        {doc.verified ? (
                           <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
                             <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                           </span>
                        ) : doc.review ? (
                           <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                             <AlertCircle className="w-3.5 h-3.5 mr-1" /> Needs Review
                           </span>
                        ) : doc.missing ? (
                           <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                             <AlertCircle className="w-3.5 h-3.5 mr-1" /> Missing
                           </span>
                        ) : null}
                      </td>
                      <td className="p-4 text-right">
                        {doc.missing ? (
                           <button onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-accent hover:underline">Upload</button>
                        ) : (
                           <button className="text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-primary-900 rounded-2xl p-6 text-white shadow-sm h-full">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
               <CheckCircle2 className="text-emerald-400 w-5 h-5" /> Application Readiness
            </h3>
            
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                  <path strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute text-3xl font-bold">{score}%</div>
              </div>
              <p className="mt-4 text-emerald-400 font-medium">Ready for submission</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Identity Documents</div>
                <span className="text-emerald-400">100%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Project Info</div>
                <span className="text-emerald-400">100%</span>
              </div>
              <div className="flex items-center justify-between text-sm opacity-60">
                <div className="flex items-center gap-2">
                  {documents.find(d => d.name === "Site Plan.pdf")?.verified ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                  Site Plan
                </div>
                <span className={documents.find(d => d.name === "Site Plan.pdf")?.verified ? "text-emerald-400" : "text-amber-400"}>
                  {documents.find(d => d.name === "Site Plan.pdf")?.verified ? "Verified" : "Needs Review"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm opacity-60">
                <div className="flex items-center gap-2">
                  {documents.find(d => d.name.includes("Pollution") && !d.missing) ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                  Pollution Consent
                </div>
                <span className={documents.find(d => d.name.includes("Pollution") && !d.missing) ? "text-emerald-400" : "text-red-400"}>
                  {documents.find(d => d.name.includes("Pollution") && !d.missing) ? "Verified" : "Missing"}
                </span>
              </div>
            </div>

            <PressableButton3D 
              onClick={runAiPreCheck}
              disabled={isChecking}
              className="w-full mt-8 flex items-center justify-center bg-accent hover:bg-accent-hover text-white py-3 rounded-xl font-medium transition-colors text-sm disabled:opacity-50"
            >
              {isChecking ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/> Analyzing with Groq AI...</> : "Run Groq AI Pre-Check"}
            </PressableButton3D>
          </div>
        </div>
      </div>

      {/* OCR Review Modal */}
      <AnimatePresence>
        {showModal && (
          <GlassPanel overlay isOpen onClose={() => setShowModal(false)}>
            <div className="overflow-hidden rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-white/20 flex justify-between items-center bg-slate-50/80">
                <div>
                  <h3 className="font-bold text-lg text-primary-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> AI/OCR Extracted Data
                  </h3>
                  <p className="text-sm text-slate-500">Please verify the extracted information before saving.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white/90">
                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>We extracted the following fields from <strong>{currentFile?.name}</strong>. You can edit any incorrect values below. We will never overwrite your manual entries without your permission.</p>
                </div>
                
                <div className="space-y-4 mt-6">
                  {Object.entries(extractedData || {}).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input 
                        type="text" 
                        value={value as string} 
                        onChange={(e) => setExtractedData({...extractedData, [key]: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent text-slate-800"
                      />
                    </div>
                  ))}
                  
                  {Object.keys(extractedData || {}).length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No structured fields could be automatically extracted. You can still save the document.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-5 border-t border-white/20 bg-slate-50/80 flex justify-end gap-3">
                <PressableButton3D 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-slate-600 hover:bg-slate-200 font-medium rounded-lg transition-colors bg-white border border-slate-200"
                >
                  Cancel
                </PressableButton3D>
                <PressableButton3D 
                  onClick={handleSaveData}
                  className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Verified Data
                </PressableButton3D>
              </div>
            </div>
          </GlassPanel>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentVault;
