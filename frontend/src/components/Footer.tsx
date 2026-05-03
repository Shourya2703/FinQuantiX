import React from 'react';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/30 relative z-40 bg-background mt-auto shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.05)]">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col items-start gap-12">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase">FIN<span className="text-primary">Q</span></span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-10">
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">© 2026 FINQ Systems. Engineered for Precision.</p>
        </div>
      </div>
    </footer>
  );
}
