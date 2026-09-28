import React from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, ShieldCheck, CheckSquare, Plus } from 'lucide-react';

const ComplianceCalendar = () => {
  const events = [
    { date: "Oct 25, 2025", title: "License Renewal", type: "warning", desc: "Factory license renewal due", icon: AlertTriangle },
    { date: "Oct 28, 2025", title: "Inspection Scheduled", type: "info", desc: "Fire department site visit", icon: Clock },
    { date: "Nov 15, 2025", title: "Environmental Compliance", type: "success", desc: "Quarterly pollution return", icon: ShieldCheck },
    { date: "Dec 01, 2025", title: "Labour Compliance", type: "success", desc: "Annual employee registry update", icon: CheckSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">My Compliance Calendar</h1>
          <p className="text-slate-500 text-sm mt-1">Never miss a deadline or inspection</p>
        </div>
        <button className="flex items-center bg-primary-900 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-800 shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-slate-800">October 2025</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50">Prev</button>
              <button className="px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50">Next</button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-slate-50 text-center py-2 text-xs font-semibold text-slate-500">
                {day}
              </div>
            ))}
            
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={`bg-white min-h-[80px] p-2 ${i === 24 ? 'bg-amber-50/50' : i === 27 ? 'bg-blue-50/50' : ''}`}>
                <span className={`text-sm font-medium ${
                  i === 24 ? 'bg-amber-100 text-amber-700 w-6 h-6 flex items-center justify-center rounded-full' : 
                  i === 27 ? 'bg-blue-100 text-blue-700 w-6 h-6 flex items-center justify-center rounded-full' : 
                  'text-slate-700'
                }`}>
                  {i + 1}
                </span>
                {i === 24 && <div className="mt-1 text-[10px] font-medium text-amber-600 bg-amber-100 p-1 rounded leading-tight truncate">License Renewal</div>}
                {i === 27 && <div className="mt-1 text-[10px] font-medium text-blue-600 bg-blue-100 p-1 rounded leading-tight truncate">Inspection</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-primary-900">Upcoming Events</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {events.map((event, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    event.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <event.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800">{event.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{event.desc}</p>
                    <span className="inline-block mt-2 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {event.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendar;
