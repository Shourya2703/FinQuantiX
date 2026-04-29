import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-indigo-500/30 relative z-40 bg-slate-950/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(79,70,229,0.15)] mt-auto">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">FinQuantiX</span>
        </div>
        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
        </div>
        <p className="text-sm text-slate-600">© 2026 FinQuantiX AI. Built for the future of finance.</p>
      </div>
    </footer>
  );
}
