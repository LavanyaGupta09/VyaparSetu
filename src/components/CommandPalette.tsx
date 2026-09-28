import React, { useState, useEffect } from 'react';
import { Search, Compass, FileText, Settings, Shield, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const commands = [
  { id: 'roadmap', title: 'Approval Roadmap', subtitle: 'View your AI-generated compliance path', icon: Compass, route: '/roadmap' },
  { id: 'new-app', title: 'Start New Application', subtitle: 'Apply for a new NOC or License', icon: FileText, route: '/application' },
  { id: 'consent', title: 'Privacy & Consent Ledger', subtitle: 'Manage department access to your data', icon: Shield, route: '/settings/consent' },
  { id: 'advisor', title: 'Site Advisor', subtitle: 'Find the best industrial zone', icon: Search, route: '/advisor' },
  { id: 'bpr', title: 'Process Visualizer (BPR)', subtitle: 'View business process reengineering', icon: Settings, route: '/bpr' },
  { id: 'profile', title: 'Update Company Profile', subtitle: 'Edit investment, employees, etc.', icon: User, route: '/onboarding' },
];

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.subtitle.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (route: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(route);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10"
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search commands, pages, or features..."
                className="w-full text-lg outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">ESC</span>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</div>
                  {filteredCommands.map((command) => (
                    <button
                      key={command.id}
                      onClick={() => handleSelect(command.route)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-4 group transition-colors focus:bg-blue-50 focus:outline-none"
                    >
                      <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <command.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{command.title}</h4>
                        <p className="text-xs text-slate-500">{command.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
