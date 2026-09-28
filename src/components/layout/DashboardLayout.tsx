import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Calendar, Compass, MessageSquare, Menu, Bell, User, Globe, Briefcase, Shield, MapPin, Layers, ChevronDown, Eye, Database, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserRole } from '../../context/UserRoleContext';

const SidebarContent = ({ location, t, onClose }: any) => {
  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', href: '/applications', icon: FileText },
    { name: 'Approval Roadmap', href: '/roadmap', icon: Compass },
    { name: 'Site Advisor', href: '/advisor', icon: MapPin },
    { name: 'Process Visualizer (BPR)', href: '/bpr', icon: Layers },
    { name: 'Documents', href: '/documents', icon: CheckSquare },
    { name: 'Compliance Calendar', href: '/calendar', icon: Calendar },
    { name: 'Schemes & Incentives', href: '/schemes', icon: Compass },
    { name: 'Privacy & Consent', href: '/settings/consent', icon: Shield },
    { name: 'Data Sources', href: '/settings/data', icon: Database },
    { name: 'Mitra AI', href: '/ai', icon: MessageSquare },
  ];

  return (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
        <span className="text-xl font-bold text-primary-900 tracking-tight">MAHA-SETU</span>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-500 hover:text-slate-700">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-accent-hover'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 mr-3 h-5 w-5 ${
                    isActive ? 'text-accent-hover' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                {t(item.name)}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

const DashboardLayout = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { role, setRole } = useUserRole();
  const [selectedClient, setSelectedClient] = useState('Shree Foods Pvt Ltd');
  const [highContrast, setHighContrast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.body.classList.add('contrast-125');
      document.body.style.filter = 'contrast(1.2) saturate(1.5)';
    } else {
      document.body.classList.remove('contrast-125');
      document.body.style.filter = 'none';
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/80 transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <SidebarContent location={location} t={t} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white h-full">
        <SidebarContent location={location} t={t} />
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center md:hidden gap-3">
              <button
                type="button"
                className="-ml-2 h-10 w-10 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
              <span className="text-lg font-bold text-primary-900 tracking-tight">MAHA-SETU</span>
            </div>
            <div className="flex items-center justify-end w-full space-x-4">
              <button 
                onClick={() => setRole(role === 'entrepreneur' ? 'officer' : 'entrepreneur')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${
                  role === 'officer' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                {role === 'officer' ? 'Officer Mode' : 'Client Mode'}
              </button>

              {role === 'entrepreneur' && (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-[120px]">{selectedClient}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-1 border border-slate-100 hidden group-hover:block z-50">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultant Switcher</div>
                    <button onClick={() => setSelectedClient('Shree Foods Pvt Ltd')} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Shree Foods Pvt Ltd</button>
                    <button onClick={() => setSelectedClient('TechNova Manufacturing')} className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">TechNova Manufacturing</button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button className="block w-full text-left px-3 py-2 text-sm text-accent hover:bg-slate-50 font-medium">+ Add New Client</button>
                  </div>
                </div>
              )}

              <div className="relative group">
                <button className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium">
                  <Globe className="h-5 w-5" />
                  <span className="uppercase">{i18n.language}</span>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-slate-100 hidden group-hover:block z-50">
                  <button onClick={() => i18n.changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">English</button>
                  <button onClick={() => i18n.changeLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">हिंदी (Hindi)</button>
                  <button onClick={() => i18n.changeLanguage('mr')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">मराठी (Marathi)</button>
                </div>
              </div>
              
              <button 
                onClick={toggleContrast}
                className={`text-slate-400 hover:text-slate-600 ${highContrast ? 'text-accent' : ''}`}
                title="Toggle High Contrast (Accessibility)"
              >
                <Eye className="h-5 w-5" />
              </button>

              <button className="text-slate-400 hover:text-slate-500">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">Rohit Sharma</span>
              </div>
            </div>
          </header>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
