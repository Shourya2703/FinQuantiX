import Link from 'next/link';
import { ChevronRight, ArrowRight, Activity, Zap, Shield, Globe, TrendingUp, BarChart3, Star, Cpu, Server, Fingerprint, Database, Code2, LineChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Drifting Glows */}
      <div className="drifting-glow w-[600px] h-[600px] bg-primary/20 top-[-10%] left-[-10%] -z-10"></div>
      <div className="drifting-glow w-[500px] h-[500px] bg-accent/10 bottom-[-10%] right-[-10%] -z-10" style={{ animationDelay: '-5s' }}></div>
      <div className="drifting-glow w-[400px] h-[400px] bg-primary/10 top-[40%] right-[10%] -z-10" style={{ animationDelay: '-10s' }}></div>


      <main className="container mx-auto max-w-7xl px-6 pt-64 pb-32">
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col items-start text-left z-10 relative mb-32">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel glass-glow mb-12 text-[10px] font-black uppercase tracking-[0.4em] text-white border-white/10 bg-white/5 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Neural Risk Engine v2.0
          </div>
          
          <div className="mb-16">
             <h1 className="flex flex-col items-start text-glow-white">
                <span className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none text-white uppercase mb-2">
                   Predict
                </span>
                <span className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none text-white uppercase mb-2">
                   Risk.
                </span>
                <span className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none text-white uppercase">
                   Scale Faster
                </span>
             </h1>
          </div>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-16 leading-relaxed font-medium">
            Transform raw financial telemetry into precise approval decisions. <br className="hidden md:block" /> 
            The world&apos;s most advanced ensemble risk engine.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-32 w-full">
            <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 glow-button-blue text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 group">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <div className="glass-panel glass-glow p-8 rounded-3xl border-white/5 group transition-all text-left relative overflow-hidden">
              <div className="text-3xl font-bold mb-1 tracking-tighter text-white">98.5%</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-black">Model Accuracy</div>
            </div>
            <div className="glass-panel glass-glow p-8 rounded-3xl border-white/5 group transition-all text-left relative overflow-hidden">
              <div className="text-3xl font-bold mb-1 tracking-tighter text-white">15ms</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-black">Latency</div>
            </div>
            <div className="glass-panel glass-glow p-8 rounded-3xl border-white/5 group transition-all text-left relative overflow-hidden">
              <div className="text-3xl font-bold mb-1 tracking-tighter text-white">Global</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-[0.3em] font-black">Infrastructure</div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-32 border-t border-white/5">
          <div className="flex flex-col items-start mb-20">
            <span className="text-xs font-black text-primary tracking-[0.4em] uppercase mb-4">0.2 / Intelligence</span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Engineered for <br /> Precision.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="w-6 h-6" />}
              title="Ensemble Models"
              desc="XGBoost & Random Forest architecture for ultra-stable predictions across volatile datasets."
            />
            <FeatureCard 
              icon={<Fingerprint className="w-6 h-6" />}
              title="Explainable AI"
              desc="Full SHAP value integration providing mathematical proof for every single decision."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="Live Telemetry"
              desc="Real-time monitoring of global risk distributions with sub-millisecond updates."
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6" />}
              title="Data Integrity"
              desc="Automated outlier detection and feature scaling to ensure model health 24/7."
            />
            <FeatureCard 
              icon={<Code2 className="w-6 h-6" />}
              title="API-First"
              desc="Seamlessly integrate risk scores into your existing stack with our REST endpoints."
            />
            <FeatureCard 
              icon={<LineChart className="w-6 h-6" />}
              title="What-If Analysis"
              desc="Simulate applicant scenarios to find the perfect risk/reward threshold for your capital."
            />
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section className="py-32 border-t border-white/5">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="flex flex-col items-start">
                 <span className="text-xs font-black text-primary tracking-[0.4em] uppercase mb-4">0.3 / Implementation</span>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">Deploy in <br /> Minutes.</h2>
                 <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                    Stop building risk infrastructure from scratch. Connect your data and start scaling your portfolio today.
                 </p>
              </div>
              <div className="space-y-12">
                 <WorkflowStep num="01" title="Data Ingestion" desc="Securely pipe your applicant data through our encrypted endpoints." />
                 <WorkflowStep num="02" title="AI Inference" desc="Our ensemble engine runs millions of simulations in milliseconds." />
                 <WorkflowStep num="03" title="Decisioning" desc="Receive a definitive score with a clear natural language explanation." />
              </div>
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-48 border-t border-white/5 text-left">
          <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter mb-16">Ready to <br /> Scale?</h2>
          <Link href="/dashboard" className="inline-flex items-center gap-6 text-2xl font-black text-white uppercase hover:text-primary transition-colors group">
             Launch the Predictor
             <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
          </Link>
        </section>
      </main>

      {/* Grid Pattern Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel glass-glow p-8 rounded-3xl border-white/5 hover:border-primary/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-primary group-hover:bg-primary/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function WorkflowStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="text-4xl font-black text-white/10 group-hover:text-primary/40 transition-colors">{num}</div>
      <div>
        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
  );
}
