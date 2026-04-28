"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Activity, ShieldCheck, LogOut, ChevronRight, X } from 'lucide-react';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authStep, setAuthStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('finquantix_auth') === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (authStep === 1) {
        setAuthStep(2);
      } else {
        setIsAuth(true);
        setShowModal(false);
        localStorage.setItem('finquantix_auth', 'true');
        setAuthStep(1);
        setEmail('');
        setOtp('');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('finquantix_auth');
  };

  const NavLink = ({ href, label, activeTab }: { href: string, label: string, activeTab?: string }) => {
    // Determine if active based on pathname or search params
    const isActive = pathname === href || (searchParams?.get('tab') === activeTab);
    
    return (
      <Link 
        href={href} 
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#060B19] border-b-2 border-indigo-500/20 shadow-[0_4px_30px_rgba(79,70,229,0.1)]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              FinQuantix
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <NavLink href="/dashboard?tab=new" activeTab="new" label="Predictor" />
            <NavLink href="/dashboard?tab=whatif" activeTab="whatif" label="What-If" />
            <NavLink href="/dashboard?tab=dashboard" activeTab="dashboard" label="Dashboard" />
            <NavLink href="/live-analysis" label="Live Analysis" />
          </div>

          <div className="flex items-center">
            {isAuth ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Analyst</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Sign Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowModal(true)} 
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex items-center"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full relative">
            <button onClick={() => {setShowModal(false); setAuthStep(1);}} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 mx-auto">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-center text-white mb-2">
              {authStep === 1 ? 'Secure Sign In' : 'Verify Identity'}
            </h3>
            <p className="text-center text-slate-400 mb-8 text-sm">
              {authStep === 1 ? 'Enter your corporate email to receive a secure OTP.' : `We sent a code to ${email} (Demo: Use any 6 digits)`}
            </p>

            <form onSubmit={handleAuth} className="space-y-5">
              {authStep === 1 ? (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Corporate Email</label>
                  <input 
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder="analyst@finquantix.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">One-Time Password</label>
                  <input 
                    type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="••••••"
                    maxLength={6}
                  />
                </div>
              )}
              
              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  authStep === 1 ? 'Send Secure Code' : 'Verify & Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="h-20 bg-[#060B19] border-b-2 border-indigo-500/20"></nav>}>
      <NavbarContent />
    </Suspense>
  );
}
