import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, FileText, CheckCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-900 tracking-tight">MAHA-SETU</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Features</a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 text-sm font-medium">About</a>
              <a href="#help" className="text-slate-600 hover:text-slate-900 text-sm font-medium">Help</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                Login
              </Link>
              <Link
                to="/onboarding"
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-16 pb-32 flex items-center justify-center overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-primary-900 tracking-tight mb-6">
                Start. Operate. Grow.
                <span className="block text-accent">One intelligent platform for India's industrial journey.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-500 mx-auto mb-10">
                Discover approvals, prepare applications, track compliance, coordinate inspections and find government support — from one place.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/onboarding"
                  className="bg-primary-900 hover:bg-primary-800 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Build My Approval Roadmap <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-lg font-medium shadow-sm transition-all">
                  Explore Platform
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 bg-slate-50/50">
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-3xl rounded-full"></div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">From confusion to clarity.</h2>
            <p className="text-slate-500 mb-16 max-w-2xl mx-auto">The intelligent orchestration of your entire industrial journey.</p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-slate-600">
              {['Business Profile', 'AI Roadmap', 'Documents', 'Applications', 'Inspections', 'Approvals', 'Compliance', 'Growth'].map((step, i) => (
                <React.Fragment key={step}>
                  <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full shadow-sm">{step}</div>
                  {i < 7 && <ArrowRight className="h-4 w-4 text-slate-300 hidden md:block" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
