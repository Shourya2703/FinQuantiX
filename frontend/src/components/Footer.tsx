import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[#00A9FF]/20 relative z-40 bg-[#030820]/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,169,255,0.1)] mt-auto">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,231,255,0.3)]">
            <Image src="/neon-logo.png" alt="FinQuantiX" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">FinQuantiX</span>
        </div>
        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-[#00E7FF] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#00E7FF] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#00E7FF] transition-colors">API Docs</a>
        </div>
        <p className="text-sm text-slate-600">© 2026 FinQuantiX AI. Built for the future of finance.</p>
      </div>
    </footer>
  );
}
