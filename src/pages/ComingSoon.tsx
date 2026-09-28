import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 bg-blue-50 text-accent rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-primary-900 mb-4">Feature Coming Soon</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        This section is currently under active development for the hackathon prototype. Check back soon for updates!
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );
};

export default ComingSoon;
