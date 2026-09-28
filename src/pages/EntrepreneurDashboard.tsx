import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight, Activity, Calendar, Zap, FileSearch, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemoControl } from '../context/DemoControlContext';

const EntrepreneurDashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const { timeOffsetDays } = useDemoControl();

  const loadApps = () => {
    const stored = localStorage.getItem('maha_applications') || localStorage.getItem('vyapar_applications');
    if (stored) setApplications(JSON.parse(stored));
  };

  useEffect(() => {
    loadApps();
    window.addEventListener('storage', loadApps);
    return () => window.removeEventListener('storage', loadApps);
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Good morning, Rohit! 👋</h1>
          <p className="text-slate-500">What should we help you accomplish today?</p>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Ask Mitra AI..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-white shadow-sm"
          />
          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Approval Health</p>
            <h3 className="text-3xl font-bold text-emerald-600">78%</h3>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 mr-1" /> On track
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Actions</p>
            <h3 className="text-3xl font-bold text-primary-900">4</h3>
          </div>
          <Link to="/actions" className="mt-4 text-xs font-medium text-accent hover:text-accent-hover flex items-center">
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Upcoming Deadlines</p>
            <h3 className="text-3xl font-bold text-primary-900">3</h3>
          </div>
          <Link to="/calendar" className="mt-4 text-xs font-medium text-accent hover:text-accent-hover flex items-center">
            View calendar <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-accent p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100 mb-1">Scheme Opportunities</p>
            <h3 className="text-3xl font-bold">6</h3>
          </div>
          <Link to="/schemes" className="mt-4 text-xs font-medium text-white hover:text-blue-50 flex items-center bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
            Explore now <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-primary-900">Today's Actions</h2>
            <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" /> 1 High Priority
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { title: "Upload updated site plan", desc: "Required for pending query", type: "high", time: "2 days left", icon: FileText },
              { title: "Review Pollution Consent application", desc: "AI pre-check complete", type: "medium", time: "5 days left", icon: FileSearch },
              { title: "Inspection scheduled tomorrow", desc: "Fire department site visit", type: "info", time: "Tomorrow, 10 AM", icon: Clock },
              { title: "Renewal due in 28 days", desc: "Factory license renewal", type: "low", time: "Next month", icon: Calendar }
            ].map((action, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 cursor-pointer">
                <div className={`p-2 rounded-lg ${
                  action.type === 'high' ? 'bg-red-50 text-red-600' :
                  action.type === 'medium' ? 'bg-amber-50 text-amber-600' :
                  action.type === 'info' ? 'bg-blue-50 text-blue-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 text-sm">{action.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    action.type === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : 'text-slate-400'
                  }`}>
                    {action.time}
                  </span>
                  {action.type === 'high' && (
                    <button className="text-xs font-medium text-accent mt-2 hover:underline">Act now</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {applications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50">
              <div className="p-6 pb-2">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Recently Submitted Applications</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {applications.map((app, i) => {
                  const isBreached = timeOffsetDays > 14 && app.status !== 'Approved';
                  const isApproved = app.status === 'Approved';
                  return (
                    <div key={i} className={`p-4 transition-colors flex items-center justify-between ${isBreached ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isBreached ? 'bg-red-100 text-red-600' : isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          {isApproved ? <CheckCircle2 className="w-5 h-5" /> : isBreached ? <AlertCircle className="w-5 h-5 animate-pulse" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{app.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">ID: {app.id} • {timeOffsetDays > 0 ? `${timeOffsetDays} days ago` : 'Today'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isBreached && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">SLA BREACHED</span>}
                        {isApproved ? (
                          <Link to={`/certificate/${app.id}`} className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-accent/20 transition-colors">
                            <Download className="w-3 h-3" /> Certificate
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                            {app.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-primary-900 rounded-2xl shadow-sm overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-32 h-32" />
          </div>
          <div className="p-6 relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                <Activity className="w-5 h-5 text-blue-300" />
              </div>
              <h2 className="text-xl font-bold mb-2">Your Industrial Journey Simplified</h2>
              <p className="text-blue-200 text-sm mb-6">
                Based on your profile, we've analyzed all required approvals and optimized them for parallel processing.
              </p>
            </div>
            <div>
              <Link to="/roadmap" className="w-full bg-white text-primary-900 py-3 rounded-xl font-medium text-sm flex justify-center items-center hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                View Smart Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
