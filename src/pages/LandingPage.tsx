import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, FileText, CheckCircle, Shield } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero3D = React.lazy(() => import('../components/Hero3D'));

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
              <Link to="/auth" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                Login
              </Link>
              <Link
                to="/auth"
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-16 pb-32 flex items-center justify-center overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-primary-900 tracking-tight mb-6">
                Start. Operate. Grow.
                <span className="block text-accent mt-2">One intelligent platform for India's industrial journey.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-500 mb-10">
                Discover approvals, prepare applications, track compliance, coordinate inspections and find government support — from one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/auth"
                  className="btn-3d bg-primary-900 hover:bg-primary-800 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  Build My Approval Roadmap <ArrowRight className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => {
                    localStorage.setItem('maha_demo_mode', 'true');
                    window.location.href = '/dashboard';
                  }} 
                  className="btn-3d bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-lg font-medium transition-all"
                >
                  Explore with sample data (Judges)
                </button>
              </div>
            </motion.div>
            
            <div className="hidden md:block">
              <Suspense fallback={<div className="w-full h-[500px] flex items-center justify-center">Loading 3D experience...</div>}>
                <Hero3D />
              </Suspense>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 bg-slate-50/50">
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 blur-3xl rounded-full"></div>
          </div>
        </div>

        {/* Journey Section with Scroll Parallax */}
        <JourneySection />
      </main>
    </div>
  );
};

const JourneySection = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <div className="relative py-20 bg-white border-t border-slate-100 overflow-hidden">
      <motion.div style={{ y: yBg }} className="absolute inset-0 bg-slate-50/30 -z-10" />
      <motion.div style={{ y: yContent }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-primary-900 mb-4">From confusion to clarity.</h2>
        <p className="text-slate-500 mb-16 max-w-2xl mx-auto">The intelligent orchestration of your entire industrial journey.</p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-slate-600 relative perspective-1000">
          {['Business Profile', 'AI Roadmap', 'Documents', 'Applications', 'Inspections', 'Approvals', 'Compliance', 'Growth'].map((step, i) => (
            <React.Fragment key={step}>
              <motion.div 
                whileHover={{ scale: 1.05, translateZ: 20 }}
                className="bg-white border border-slate-200 px-4 py-2 rounded-full shadow-md preserve-3d"
              >
                {step}
              </motion.div>
              {i < 7 && <ArrowRight className="h-4 w-4 text-slate-300 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
