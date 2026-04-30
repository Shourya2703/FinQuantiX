import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, ChevronRight, BarChart3, Database, Globe, Lock, Cpu, ArrowUpRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#03091A] text-white font-sans selection:bg-[#00A9FF]/30">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay z-0"></div>
      
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0055FF]/15 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00E7FF]/8 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow animation-delay-2000 pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[60%] w-[30%] h-[30%] bg-[#0088FF]/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow animation-delay-4000 pointer-events-none z-0"></div>

      <section className="relative z-40 container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#00E7FF]/30 bg-[#00E7FF]/10 text-[#00E7FF] text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-md animate-fade-in-up shadow-[0_0_15px_rgba(0,231,255,0.15)]">
              <span className="flex h-2 w-2 rounded-full bg-[#00E7FF] mr-2 animate-ping-slow"></span>
              v2.0: Now with SHAP 3.0 Support
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300">Decide with</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055FF] via-[#00E7FF] to-[#0055FF] animate-gradient-x drop-shadow-[0_0_30px_rgba(0,231,255,0.4)]">Absolute Clarity.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 animate-fade-in-up leading-relaxed mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
              Transform complex financial data into confident credit decisions. Powered by advanced ensemble machine learning and real-time SHAP explainability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/dashboard" className="neon-btn px-8 py-4 rounded-full bg-[#0055FF] hover:bg-[#006AFF] text-white font-semibold text-lg transition-all shadow-[0_0_25px_rgba(0,85,255,0.4)] hover:shadow-[0_0_50px_rgba(0,231,255,0.6)] hover:-translate-y-1 flex items-center justify-center group border border-[#00A9FF]/30">
                <span>Get Started Free</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-[#00A9FF]/20 text-white font-semibold text-lg transition-all backdrop-blur-md flex items-center justify-center group hover:border-[#00E7FF]/50 hover:shadow-[0_0_25px_rgba(0,231,255,0.15)]">
                See How It Works
                <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#00E7FF]">98.5%</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">Accuracy</span>
              </div>
              <div className="w-px h-8 bg-[#0055FF]/30"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#00E7FF]">2.4ms</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">Inference</span>
              </div>
              <div className="w-px h-8 bg-[#0055FF]/30"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#00E7FF]">10k+</span>
                <span className="text-xs uppercase tracking-widest text-slate-500">Trained</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative group hero-container">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#0055FF] via-[#00E7FF] to-[#0055FF] rounded-[2.5rem] blur-lg opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-border-glow"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00E7FF] to-[#0055FF] rounded-[2.5rem] opacity-20 animate-rotate-glow"></div>
              <div className="relative bg-[#050D2A] rounded-[2.5rem] border border-[#00E7FF]/20 overflow-hidden shadow-[0_0_40px_rgba(0,231,255,0.1)]">
                <Image 
                  src="/hero-exact-blue.png" 
                  alt="FinQuantiX AI Shield" 
                  width={800} 
                  height={800} 
                  className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700 animate-float"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03091A] via-transparent to-transparent opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-[#0055FF]/20 bg-[#030820]/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <p className="text-center text-[#00E7FF] text-sm font-bold uppercase tracking-[0.4em] mb-12 drop-shadow-[0_0_10px_rgba(0,231,255,0.4)]">Trusted by global financial institutions</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80 hover:opacity-100 transition-all duration-700">
             <div className="flex items-center gap-3 text-slate-200 hover:text-[#00E7FF] transition-colors group">
                <Globe className="w-6 h-6 text-[#00A9FF] group-hover:scale-110 transition-transform" /> 
                <span className="text-xl font-bold font-mono tracking-tighter">GLOBAL BANK</span>
             </div>
             <div className="flex items-center gap-3 text-slate-200 hover:text-[#00E7FF] transition-colors group">
                <Lock className="w-6 h-6 text-[#00A9FF] group-hover:scale-110 transition-transform" /> 
                <span className="text-xl font-bold font-mono tracking-tighter">SECURE CAPITAL</span>
             </div>
             <div className="flex items-center gap-3 text-slate-200 hover:text-[#00E7FF] transition-colors group">
                <Database className="w-6 h-6 text-[#00A9FF] group-hover:scale-110 transition-transform" /> 
                <span className="text-xl font-bold font-mono tracking-tighter">DATA TRUST</span>
             </div>
             <div className="flex items-center gap-3 text-slate-200 hover:text-[#00E7FF] transition-colors group">
                <Cpu className="w-6 h-6 text-[#00A9FF] group-hover:scale-110 transition-transform" /> 
                <span className="text-xl font-bold font-mono tracking-tighter">QUANTUM FIN</span>
             </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 relative z-40 container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9FF] to-[#00E7FF]">Precision</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our multi-layered risk assessment engine combines traditional financial logic with cutting-edge deep learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card p-10 rounded-[2rem] bg-[#050D2A]/60 border border-[#0055FF]/20 backdrop-blur-xl group hover:border-[#00A9FF]/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,136,255,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0055FF]/5 blur-[60px] -mr-20 -mt-20 group-hover:bg-[#00A9FF]/15 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00E7FF]/3 blur-[50px] -ml-16 -mb-16 group-hover:bg-[#00E7FF]/10 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-[#0055FF]/20 border border-[#0055FF]/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_25px_rgba(0,85,255,0.4)] group-hover:border-[#00A9FF]/50">
              <BarChart3 className="w-7 h-7 text-[#00A9FF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">SHAP Explainability</h3>
            <p className="text-slate-400 leading-relaxed">
              Open the black box of AI. Every decision is mathematically attributed to specific features, providing full auditability for compliance.
            </p>
          </div>
          
          <div className="feature-card p-10 rounded-[2rem] bg-[#050D2A]/60 border border-[#00A9FF]/20 backdrop-blur-xl group hover:border-[#00E7FF]/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,231,255,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00A9FF]/5 blur-[60px] -mr-20 -mt-20 group-hover:bg-[#00E7FF]/15 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0055FF]/3 blur-[50px] -ml-16 -mb-16 group-hover:bg-[#0055FF]/10 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-[#00A9FF]/20 border border-[#00A9FF]/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_25px_rgba(0,169,255,0.4)] group-hover:border-[#00E7FF]/50">
              <Zap className="w-7 h-7 text-[#00E7FF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Live Simulator</h3>
            <p className="text-slate-400 leading-relaxed">
              Experience the power of real-time &quot;What-If&quot; analysis. Adjust any parameter and watch the risk surface adapt instantly with ultra-low latency.
            </p>
          </div>
          
          <div className="feature-card p-10 rounded-[2rem] bg-[#050D2A]/60 border border-[#0088FF]/20 backdrop-blur-xl group hover:border-[#00A9FF]/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,136,255,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0088FF]/5 blur-[60px] -mr-20 -mt-20 group-hover:bg-[#0088FF]/15 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00E7FF]/3 blur-[50px] -ml-16 -mb-16 group-hover:bg-[#00E7FF]/10 transition-all"></div>
            <div className="w-14 h-14 rounded-2xl bg-[#0088FF]/20 border border-[#0088FF]/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_25px_rgba(0,136,255,0.4)] group-hover:border-[#00A9FF]/50">
              <Shield className="w-7 h-7 text-[#00A9FF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Secure &amp; Scalable</h3>
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
          animation: gradient-x 4s ease infinite;
        }

        @keyframes pulse-slow {
          0% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.1); }
          100% { opacity: 0.15; transform: scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite alternate; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        @keyframes border-glow {
          0%, 100% { opacity: 0.2; filter: blur(15px); }
          50% { opacity: 0.45; filter: blur(20px); }
        }
        .animate-border-glow { animation: border-glow 3s ease-in-out infinite; }

        @keyframes rotate-glow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-rotate-glow { 
          animation: rotate-glow 20s linear infinite;
          background: conic-gradient(from 0deg, #0055FF, #00E7FF, #0088FF, #00E7FF, #0055FF);
          border-radius: 2.5rem;
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }

        .neon-btn {
          position: relative;
          overflow: hidden;
        }
        .neon-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, rgba(0, 231, 255, 0.15), transparent 30%);
          animation: rotate-glow 4s linear infinite;
        }
        .neon-btn::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: inherit;
          border-radius: inherit;
          z-index: 0;
        }
        .neon-btn span, .neon-btn svg {
          position: relative;
          z-index: 10;
        }

        .feature-card {
          position: relative;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 2rem;
          padding: 1px;
          background: linear-gradient(135deg, rgba(0,169,255,0.2), transparent, rgba(0,231,255,0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .feature-card:hover::before {
          background: linear-gradient(135deg, rgba(0,231,255,0.4), rgba(0,85,255,0.2), rgba(0,231,255,0.3));
        }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />
    </div>
  );
}
