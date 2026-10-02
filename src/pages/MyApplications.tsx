import React, { useState, useMemo } from 'react';
import { 
  FileText, Plus, Search, Filter, Download, Activity, Clock, 
  AlertCircle, CheckCircle2, ChevronRight, Play, MoreVertical, 
  Calendar, Info, AlertTriangle, Eye, Trash2, X, UploadCloud, RotateCcw
} from 'lucide-react';
import { useApplications, type Application, type AppStatus } from '../hooks/useApplications';
import { calculateSlaDeadline } from '../services/publicApis';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { evaluateProfile } from '../engine/rulesEngine';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const MyApplications = () => {
  const { applications, updateApplication, deleteApplication, addApplication } = useApplications();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'All' | 'Drafts' | 'Submitted' | 'Needs Action' | 'Completed'>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [treePaid, setTreePaid] = useState(() => localStorage.getItem('demo_tree_paid') === 'true');

  const handleRazorpayPayment = async () => {
    setIsProcessingPayment(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessingPayment(false);
      return;
    }

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 25000 })
      });
      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: order.amount,
        currency: order.currency,
        name: 'MAHA-SETU Government of Maharashtra',
        description: 'Tree Cutting Replantation Deposit',
        order_id: order.id,
        handler: function (response: any) {
          localStorage.setItem('demo_tree_paid', 'true');
          setTreePaid(true);
          setShowPayment(false);
        },
        prefill: {
          name: 'Rohit Enterprises',
          email: 'rohit@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#1e3a8a'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert('Could not initiate payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  
  // Calculate summary counts
  const summary = useMemo(() => {
    return {
      total: applications.length,
      inProgress: applications.filter(a => ['Draft', 'Submitted'].includes(a.status)).length,
      actionRequired: applications.filter(a => a.status === 'Action Required').length,
      waiting: applications.filter(a => a.health === 'Waiting for Department').length,
      delayed: applications.filter(a => a.status === 'Delayed').length,
      approved: applications.filter(a => a.status === 'Approved').length,
    };
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                            app.id.toLowerCase().includes(search.toLowerCase()) ||
                            app.department.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (activeTab === 'Drafts') return app.status === 'Draft';
      if (activeTab === 'Submitted') return app.status === 'Submitted';
      if (activeTab === 'Needs Action') return app.status === 'Action Required' || app.status === 'Delayed';
      if (activeTab === 'Completed') return app.status === 'Approved';
      return true;
    });
  }, [applications, activeTab, search]);

  const handleAction = (app: Application, action: string) => {
    if (action === 'withdraw') {
      if(window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) {
        deleteApplication(app.id);
      }
    } else if (action === 'view') {
      navigate('/application?name=' + encodeURIComponent(app.name));
    } else if (action === 'upload') {
      updateApplication(app.id, { readinessScore: Math.min(100, app.readinessScore + 15), pendingItems: [] });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Action Required': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Delayed': return 'bg-red-50 text-red-700 border-red-200';
      case 'Submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'Action Required': return <AlertTriangle className="w-4 h-4" />;
      case 'Delayed': return <Clock className="w-4 h-4" />;
      case 'Submitted': return <RotateCcw className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
            My Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track every approval in one place.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm hidden md:flex">
            <Download className="w-4 h-4 mr-2" /> Export (CSV)
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Start New Application
          </button>
        </div>
      </div>

      {/* Start in Parallel Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-accent rounded-full flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 ml-0.5" />
          </div>
          <div>
            <h3 className="font-bold text-primary-900">Accelerate your timeline</h3>
            <p className="text-sm text-slate-600">You have 3 approvals that can be started simultaneously.</p>
          </div>
        </div>
        <button onClick={() => navigate('/coming-soon')} className="w-full sm:w-auto px-4 py-2 bg-white border border-blue-200 text-accent rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
          Start in Bulk
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: summary.total, color: 'text-slate-800' },
          { label: 'In Progress', value: summary.inProgress, color: 'text-blue-600' },
          { label: 'Action Required', value: summary.actionRequired, color: 'text-amber-600' },
          { label: 'Waiting for Dept', value: summary.waiting, color: 'text-indigo-600' },
          { label: 'Delayed', value: summary.delayed, color: 'text-red-600' },
          { label: 'Approved', value: summary.approved, color: 'text-emerald-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          
          {/* Toolbar & Tabs */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 justify-between items-center">
            <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar gap-1 p-1">
              {['All', 'Drafts', 'Submitted', 'Needs Action', 'Completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex w-full md:w-auto items-center gap-2 px-1">
              <div className="relative flex-1 md:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <button className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List Area */}
          <div className="space-y-4" aria-live="polite">
            {filteredApps.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No applications found</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">Build your roadmap or adjust your filters to see applications here.</p>
                <button onClick={() => {setSearch(''); setActiveTab('All');}} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Clear Filters</button>
              </div>
            ) : (
              filteredApps.map(app => (
                <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-accent/50 transition-colors group cursor-pointer" onClick={() => handleAction(app, 'view')}>
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      
                      {/* Left Block */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{app.id}</span>
                          <span className="text-xs font-medium text-slate-500 px-2 py-0.5 bg-slate-100 rounded">{app.department}</span>
                          {app.predictiveDelay && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {app.predictiveDelay} (AI)
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-accent transition-colors">{app.name}</h3>
                        
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)} {app.status}
                          </span>
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> Health: {app.health}
                          </span>
                          {app.submittedAt && (
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> 
                              Deadline: {calculateSlaDeadline(new Date(app.submittedAt), app.slaDays).deadline.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Right Block */}
                      <div className="md:w-64 flex flex-col justify-between shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-slate-500">AI Readiness</span>
                            <span className="text-xs font-bold text-slate-700">{app.readinessScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${app.readinessScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${app.readinessScore}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {app.pendingItems.length > 0 ? (
                            <div className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1.5 rounded flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <ul className="list-disc list-inside">
                                {app.pendingItems.map((item, i) => <li key={i} className="line-clamp-1">{item}</li>)}
                              </ul>
                            </div>
                          ) : (
                            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              All requirements met
                            </div>
                          )}
                        </div>
                        
                        {app.costOfDelay > 0 && (
                          <div className="mt-2 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                            Holding Cost: ₹{app.costOfDelay.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Footer */}
                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                    <button className="text-xs font-medium text-slate-500 hover:text-accent flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Why am I seeing this?
                    </button>
                    <div className="flex items-center gap-2">
                      {app.status === 'Draft' && (
                        <button onClick={() => handleAction(app, 'view')} className="px-3 py-1.5 bg-accent text-white text-xs font-bold rounded hover:bg-accent-hover transition-colors">
                          Resume Application
                        </button>
                      )}
                      {app.status === 'Action Required' && (
                        <button onClick={() => handleAction(app, 'upload')} className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600 transition-colors flex items-center gap-1">
                          <UploadCloud className="w-3.5 h-3.5"/> Resolve Query
                        </button>
                      )}
                      <div className="relative group">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 bottom-full mb-1 w-48 bg-white border border-slate-200 shadow-xl rounded-lg py-1 hidden group-hover:block z-20">
                          <button onClick={() => handleAction(app, 'view')} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye className="w-3.5 h-3.5"/> View Details</button>
                          <button onClick={() => navigate('/coming-soon')} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Download className="w-3.5 h-3.5"/> Download Summary</button>
                          <div className="border-t border-slate-100 my-1"></div>
                          <button onClick={() => handleAction(app, 'withdraw')} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Withdraw</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="hidden xl:block xl:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" /> Today's Focus
            </h3>
            <div className="space-y-4">
              {!treePaid && (
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-indigo-300">Overdue</span>
                  <p className="text-sm font-medium mt-1">Submit Tree Cutting Replantation deposit</p>
                  <button onClick={() => setShowPayment(true)} className="mt-3 w-full py-1.5 bg-white text-indigo-900 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">Pay Now</button>
                </div>
              )}
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-amber-300">Action Required</span>
                <p className="text-sm font-medium mt-1">Reply to queries on Pollution CTE</p>
                <button onClick={() => navigate('/query?name=Reply+to+queries+on+Pollution+CTE')} className="mt-3 w-full py-1.5 border border-white/30 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors">View Query</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Start New Application</h2>
                  <p className="text-sm text-slate-500 mt-1">Select an approval required based on your business profile.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                {evaluateProfile({ industry: 'Food Processing', investment: 15, employees: 40, hazardous: false, construction: true }).filter((e: any) => !applications.find(a => a.name === e.approval.name)).map((ev: any) => (
                  <div key={ev.approval.id} className="border border-slate-200 rounded-xl p-4 hover:border-accent hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800">{ev.approval.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">{ev.approval.department}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{ev.approval.plainLanguageExplanation}</p>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <span className="text-xs font-medium text-accent hover:underline cursor-pointer">Why is this required?</span>
                      <button onClick={() => {
                        setIsModalOpen(false);
                        navigate('/application?name=' + encodeURIComponent(ev.approval.name));
                      }} className="px-4 py-1.5 bg-primary-900 text-white text-xs font-bold rounded-lg hover:bg-primary-800 transition-colors flex items-center gap-1">
                        Start <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sandbox Payment</h2>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mt-1">Test Payment Environment - No real money is processed</p>
                </div>
                <button onClick={() => setShowPayment(false)} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6">
                <div className="mb-6 bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">Item Description</p>
                  <p className="font-bold text-slate-800 mb-4">Tree Cutting Replantation deposit</p>
                  
                  <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-500">Amount Due</p>
                    <p className="text-2xl font-bold text-primary-900">₹ 25,000</p>
                  </div>
                </div>
                <button 
                  onClick={handleRazorpayPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isProcessingPayment ? 'Processing...' : 'Proceed to Sandbox Checkout'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyApplications;
