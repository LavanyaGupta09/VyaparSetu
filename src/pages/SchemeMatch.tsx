import React, { useState, useEffect } from 'react';
import { Sparkles, Bookmark, ExternalLink, Loader2, X, ChevronDown, CheckCircle2, Info, FileText } from 'lucide-react';
import { aiService } from '../services/aiService';

const SchemeMatch = () => {
  const [schemes, setSchemes] = useState([
    { title: "MSME Support Scheme", type: "Potentially Relevant", desc: "Up to 30% subsidy for MSME units in manufacturing sector.", match: "95%" },
    { title: "Green Energy Incentive", type: "Potentially Relevant", desc: "Tax rebate for switching to solar energy.", match: "88%" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [schemeDetails, setSchemeDetails] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const viewSchemeDetails = async (scheme: any) => {
    setSelectedScheme(scheme);
    setIsDetailLoading(true);
    setSchemeDetails(null);
    try {
      const replyStr = await aiService.chat([
        { role: 'system', content: 'You are an expert on Maharashtra government schemes. Given a scheme title and description, provide structured details. Fill the whyRequired field, list the required documents, set the authority, and status. Output strictly as JSON following the schema.' },
        { role: 'user', content: `Scheme: ${scheme.title}\nDescription: ${scheme.desc}` }
      ], { locale: 'en' });
      
      let replyData;
      try {
        replyData = JSON.parse(replyStr);
      } catch (parseErr) {
        console.error("Failed to parse scheme details JSON", parseErr);
        replyData = { cards: [{ whyRequired: replyStr }] };
      }
      
      const card = replyData.cards && replyData.cards.length > 0 ? replyData.cards[0] : replyData;
      setSchemeDetails(card);
    } catch (e) {
      setSchemeDetails({ message: 'Failed to load scheme details. Please try again later.' });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const fetchDynamicSchemes = async () => {
    setIsLoading(true);
    try {
      const schemesResult = await aiService.findSchemes({ industry: "Food Processing", location: "Pune", scale: "Medium" });
      if (schemesResult && schemesResult.length > 0) {
        // Merge AI discovered schemes with existing ones
        setSchemes([...schemesResult, { title: "Women Entrepreneur Fund", type: "Requires More Info", desc: "Special interest rates for women-led businesses.", match: "??%" }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
           <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-200 font-medium text-sm mb-4 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4" /> Powered by Groq AI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover government support matched to your business.</h1>
          <p className="text-blue-100 mb-8 text-lg opacity-90">
            Based on your profile, Groq AI has dynamically identified subsidies and incentives you might be eligible for.
          </p>
          <button 
            onClick={fetchDynamicSchemes}
            disabled={isLoading}
            className="flex items-center bg-white text-primary-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Finding Schemes...</> : "Run Deep Scheme Analysis"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  scheme.type === 'Potentially Relevant' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {scheme.type || "Potentially Relevant"}
                </span>
                <button className="text-slate-400 hover:text-accent transition-colors"><Bookmark className="w-5 h-5" /></button>
              </div>
              <h3 className="font-bold text-lg text-primary-900 mb-2">{scheme.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{scheme.desc}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500 font-medium">AI Match Confidence</span>
                <span className="text-sm font-bold text-accent">{scheme.match || "90%"}</span>
              </div>
              <button 
                onClick={() => viewSchemeDetails(scheme)}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-primary-900 border border-slate-200 py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                View Details <ExternalLink className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-primary-900">{selectedScheme.title}</h3>
              <button onClick={() => setSelectedScheme(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-6">{selectedScheme.desc}</p>
              
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> AI Analysis & Eligibility
              </h4>
              
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-8 opacity-70">
                  <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
                  <p className="text-sm">Groq AI is analyzing this scheme...</p>
                </div>
              ) : schemeDetails ? (
                <div className="space-y-4 text-sm mt-4">
                  <div className="p-4 border border-accent/20 bg-blue-50/50 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block mb-1 text-xs">Authority</span>
                      <span className="font-semibold text-accent">{schemeDetails.authority || 'State Government'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block mb-1 text-xs">Status</span>
                      <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-md">{schemeDetails.status || 'Active'}</span>
                    </div>
                  </div>

                  <details className="group border border-slate-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-4 font-medium cursor-pointer list-none bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Info className="w-4 h-4 text-accent" />
                        Why is this required?
                      </div>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </span>
                    </summary>
                    <div className="p-4 border-t border-slate-100 text-slate-600 leading-relaxed">
                      {schemeDetails.whyRequired || schemeDetails.message || schemeDetails.desc || 'Provides crucial support based on your business profile.'}
                    </div>
                  </details>

                  <details className="group border border-slate-200 rounded-xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-4 font-medium cursor-pointer list-none bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FileText className="w-4 h-4 text-accent" />
                        Required Documents
                      </div>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      </span>
                    </summary>
                    <div className="p-4 border-t border-slate-100">
                      <ul className="space-y-3">
                        {schemeDetails.documents && schemeDetails.documents.length > 0 ? (
                          schemeDetails.documents.map((doc: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> 
                              <span>{doc}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500 italic">No specific documents listed.</li>
                        )}
                      </ul>
                    </div>
                  </details>

                  <div className="pt-4 mt-6 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all">
                      {schemeDetails.actionLabel || 'Apply for Scheme'} <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeMatch;
