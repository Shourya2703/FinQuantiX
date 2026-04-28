import Link from 'next/link';
import { Shield, Activity, Zap, ChevronRight, BarChart3, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay fixed z-10"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow animation-delay-4000"></div>

      {/* Navigation handled by layout.tsx Navbar */}
      {/* Hero Section */}
      <main className="relative z-40 container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-md animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-ping-slow"></span>
            Next-Gen Risk Assessment
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Decide with</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Absolute Clarity.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Transform complex financial data into confident credit decisions. Powered by enterprise-grade Random Forest models and SHAP explainability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/dashboard" className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center justify-center group">
              Launch Platform
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all backdrop-blur-md flex items-center justify-center">
              Explore Capabilities
            </a>
          </div>
        </div>

        {/* Feature Teasers */}
        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl group hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">SHAP Explainability</h3>
            <p className="text-slate-400 leading-relaxed">
              Never guess why a decision was made. Our model breaks down every prediction into exact feature contributions using SHapley Additive exPlanations.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl group hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">Live What-If Simulator</h3>
            <p className="text-slate-400 leading-relaxed">
              Test scenarios in real-time. Adjust income, loan amounts, and credit scores to instantly visualize how risk thresholds react dynamically.
            </p>
          </div>
          
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl group hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-3">Enterprise Accuracy</h3>
            <p className="text-slate-400 leading-relaxed">
              Powered by advanced ensemble learning architectures. Track ROC AUC scores and historical performance directly from your command center.
            </p>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { 
          0% { opacity: 0; transform: translateY(30px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }

        @keyframes pulse-slow {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite alternate; }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />
    </div>
  );
}
