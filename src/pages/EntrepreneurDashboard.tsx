import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight, Activity, Calendar, Zap, FileSearch, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemoControl } from '../context/DemoControlContext';
import { TiltCard, FloatingPanel, Icon3D, PressableButton3D, ScrollReveal3D } from '../components/3d';

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

  const statCards = [
    { label: 'Approval Health', value: '78%', color: 'text-emerald-600', badge: 'On track', badgeColor: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2, iconBg: '#d1fae5', iconColor: '#059669', link: '' },
    { label: 'Pending Actions', value: '4', color: 'text-primary-900', badge: '', badgeColor: '', icon: AlertCircle, iconBg: '#fee2e2', iconColor: '#dc2626', link: '/actions', linkText: 'View all' },
    { label: 'Upcoming Deadlines', value: '3', color: 'text-primary-900', badge: '', badgeColor: '', icon: Calendar, iconBg: '#dbeafe', iconColor: '#2563eb', link: '/calendar', linkText: 'View calendar' },
    { label: 'Scheme Opportunities', value: '6', color: 'text-white', badge: '', badgeColor: '', icon: Zap, iconBg: 'rgba(255,255,255,0.2)', iconColor: '#fff', link: '/schemes', linkText: 'Explore now', gradient: true },
  ];

  return (
    <div className="space-y-6 gradient-mesh-bg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {statCards.map((card, i) => (
          <ScrollReveal3D key={card.label} delay={i * 0.08}>
            <FloatingPanel index={i}>
              <TiltCard glowColor={card.gradient ? '#6366f1' : undefined}>
                <div className={`p-6 rounded-2xl border flex flex-col justify-between h-full w-full ${
                  card.gradient 
                    ? 'bg-gradient-to-br from-indigo-500 to-accent text-white border-transparent shadow-lg shadow-indigo-500/20' 
                    : 'bg-white border-slate-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${card.gradient ? 'text-blue-100' : 'text-slate-500'}`}>{card.label}</p>
                      <h3 className={`text-3xl font-bold text-embossed ${card.color}`}>{card.value}</h3>
                    </div>
                    <Icon3D 
                      icon={card.icon} 
                      bgFrom={card.gradient ? 'rgba(255,255,255,0.15)' : card.iconBg} 
                      bgTo={card.gradient ? 'rgba(255,255,255,0.08)' : card.iconBg}
                      iconColor={card.iconColor}
                      size="md"
                    />
                  </div>
                  {card.badge && (
                    <div className={`mt-4 flex items-center text-xs font-medium ${card.badgeColor} w-fit px-2 py-1 rounded-full`}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {card.badge}
                    </div>
                  )}
                  {card.link && (
                    <Link to={card.link} className={`mt-4 text-xs font-medium flex items-center ${
                      card.gradient 
                        ? 'text-white bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors' 
                        : 'text-accent hover:text-accent-hover'
                    }`}>
                      {card.linkText} <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  )}
                </div>
              </TiltCard>
            </FloatingPanel>
          </ScrollReveal3D>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <ScrollReveal3D delay={0.2} className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary-900">Today's Actions</h2>
              <span className="text-xs font-medium bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" /> 1 High Priority
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { title: "Upload updated site plan", desc: "Required for pending query", type: "high", time: "2 days left", icon: FileText, iconBg: '#fee2e2', iconColor: '#dc2626' },
                { title: "Review Pollution Consent application", desc: "AI pre-check complete", type: "medium", time: "5 days left", icon: FileSearch, iconBg: '#fef3c7', iconColor: '#d97706' },
                { title: "Inspection scheduled tomorrow", desc: "Fire department site visit", type: "info", time: "Tomorrow, 10 AM", icon: Clock, iconBg: '#dbeafe', iconColor: '#2563eb' },
                { title: "Renewal due in 28 days", desc: "Factory license renewal", type: "low", time: "Next month", icon: Calendar, iconBg: '#f1f5f9', iconColor: '#64748b' }
              ].map((action, i) => (
                <motion.div 
                  key={i} 
                  className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-4 cursor-pointer"
                  whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
                >
                  <Icon3D icon={action.icon} bgFrom={action.iconBg} bgTo={action.iconBg} iconColor={action.iconColor} size="md" />
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
                </motion.div>
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
        </ScrollReveal3D>

        <ScrollReveal3D delay={0.35}>
          <TiltCard maxTilt={8}>
            <div className="bg-primary-900 rounded-2xl shadow-sm overflow-hidden text-white relative h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32" />
              </div>
              <div className="p-6 relative z-10 flex flex-col h-full justify-between">
                <div>
                  <Icon3D icon={Activity} bgFrom="rgba(255,255,255,0.1)" bgTo="rgba(255,255,255,0.05)" iconColor="#93c5fd" size="md" />
                  <h2 className="text-xl font-bold mb-2 mt-4">Your Industrial Journey Simplified</h2>
                  <p className="text-blue-200 text-sm mb-6">
                    Based on your profile, we've analyzed all required approvals and optimized them for parallel processing.
                  </p>
                </div>
                <div>
                  <PressableButton3D className="w-full bg-white text-primary-900 py-3 rounded-xl font-medium text-sm flex justify-center items-center hover:bg-blue-50 transition-colors">
                    <Link to="/roadmap" className="flex items-center gap-2">
                      View Smart Roadmap <ArrowRight className="w-4 h-4" />
                    </Link>
                  </PressableButton3D>
                </div>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal3D>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
