import Link from 'next/link';
import Image from 'next/image';
import { Shield, Activity, Zap, ChevronRight, BarChart3, Database, Globe, Lock, Cpu, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Background Cinematic Elements */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* Glowing Orbs - Fixed so they don't affect scroll */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow animation-delay-2000 pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow animation-delay-4000 pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative z-40 container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-md animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-ping-slow"></span>
              v2.0: Now with SHAP 3.0 Support
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Decide with</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Absolute Clarity.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 animate-fade-in-up leading-relaxed mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
              Transform complex financial data into confident credit decisions. Powered by advanced ensemble machine learning and real-time SHAP explainability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard" className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex items-center justify-center group">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all backdrop-blur-md flex items-center justify-center group hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                See How It Works
                <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">98.5%</span>
                <span className="text-xs uppercase tracking-widest">Accuracy</span>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">2.4ms</span>
                <span className="text-xs uppercase tracking-widest">Inference</span>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">10k+</span>
                <span className="text-xs uppercase tracking-widest">Trained</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#0b0f1a] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <Image 
                  src="/hero-shield.png" 
                  alt="FinQuantiX AI Shield" 
                  width={800} 
                  height={800} 
                  className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-white/5 bg-slate-950/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-center text-slate-500 text-sm font-medium uppercase tracking-[0.3em] mb-12">Trusted by global financial institutions</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Fake Logos using icons and text */}
             <div className="flex items-center gap-2">
                <Globe className="w-6 h-6" /> <span className="text-xl font-bold font-mono tracking-tighter">GLOBAL BANK</span>
             </div>
             <div className="flex items-center gap-2">
                <Lock className="w-6 h-6" /> <span className="text-xl font-bold font-mono tracking-tighter">SECURE CAPITAL</span>
             </div>
             <div className="flex items-center gap-2">
                <Database className="w-6 h-6" /> <span className="text-xl font-bold font-mono tracking-tighter">DATA TRUST</span>
             </div>
             <div className="flex items-center gap-2">
                <Cpu className="w-6 h-6" /> <span className="text-xl font-bold font-mono tracking-tighter">QUANTUM FIN</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-40 container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Engineered for Precision</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our multi-layered risk assessment engine combines traditional financial logic with cutting-edge deep learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 rounded-[2rem] bg-slate-900/40 border border-indigo-500/20 backdrop-blur-xl group hover:border-indigo-400/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-500/15 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">SHAP Explainability</h3>
            <p className="text-slate-400 leading-relaxed">
              Open the black box of AI. Every decision is mathematically attributed to specific features, providing full auditability for compliance.
            </p>
          </div>
          
          <div className="p-10 rounded-[2rem] bg-slate-900/40 border border-purple-500/20 backdrop-blur-xl group hover:border-purple-400/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-purple-500/15 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Zap className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">Live Simulator</h3>
            <p className="text-slate-400 leading-relaxed">
              Experience the power of real-time "What-If" analysis. Adjust any parameter and watch the risk surface adapt instantly with ultra-low latency.
            </p>
          </div>
          
          <div className="p-10 rounded-[2rem] bg-slate-900/40 border border-blue-500/20 backdrop-blur-xl group hover:border-blue-400/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/15 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">Secure & Scalable</h3>
            <p className="text-slate-400 leading-relaxed">
              Enterprise-grade security meets high-performance ensemble learning. Track ROC curves and model performance in a unified command center.
            </p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { 
          0% { opacity: 0; transform: translateY(40px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
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
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 10s infinite alternate; }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />
    </div>
  );
}
