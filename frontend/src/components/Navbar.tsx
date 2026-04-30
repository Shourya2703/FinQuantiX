"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ShieldCheck, LogOut, X, Sparkles, User, Mail, Lock, KeyRound } from 'lucide-react';
import Image from 'next/image';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authStep, setAuthStep] = useState(1); // 1: Info, 2: OTP
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('finquantix_auth') === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const endpoint = authMode === 'signup' ? '/auth/signup' : '/auth/login';
      const body = authMode === 'signup' 
        ? { first_name: formData.firstName, last_name: formData.lastName, email: formData.email, password: formData.password }
        : { email: formData.email };

      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        // Send OTP
        const otpRes = await fetch('http://127.0.0.1:8000/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        
        if (otpRes.ok) {
          setAuthStep(2);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } else {
        const data = await res.json();
        setError(data.detail || 'Authentication failed.');
      }
    } catch (err) {
      setError('Connection error. Is backend running?');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      if (res.ok) {
        setIsAuth(true);
        setShowModal(false);
        localStorage.setItem('finquantix_auth', 'true');
        resetForm();
        window.location.href = '/dashboard?tab=new';
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Is backend running?');
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setAuthStep(1);
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
    setOtp('');
    setError('');
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('finquantix_auth');
    window.location.href = '/';
  };

  const NavLink = ({ href, label, activeTab }: { href: string, label: string, activeTab?: string }) => {
    const isActive = pathname === href || (searchParams?.get('tab') === activeTab);
    return (
      <Link 
        href={href} 
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-[#006AFF]/20 text-[#00C8FF] border border-[#006AFF]/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#030820]/80 backdrop-blur-xl border-b border-[#00A9FF]/20 shadow-[0_4px_30px_rgba(0,169,255,0.1)]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,231,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,231,255,0.5)] group-hover:scale-105 transition-all">
              <Image src="/neon-logo.png" alt="FinQuantiX" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,231,255,0.4)]">
              FinQuantiX
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
                <div className="hidden sm:flex items-center space-x-2 text-sm text-[#00F0FF] bg-[#00E7FF]/10 px-3 py-1.5 rounded-lg border border-[#00E7FF]/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Analyst</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Sign Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {setShowModal(true); setAuthMode('login');}} 
                className="group relative px-7 py-3 rounded-2xl bg-gradient-to-r from-[#006AFF] via-[#0088FF] to-[#006AFF] bg-[length:200%_auto] animate-gradient-x hover:scale-105 transition-all duration-500 font-bold text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:shadow-[0_0_35px_rgba(0,85,255,0.6)] flex items-center space-x-2 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="tracking-tight">Sign In</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03091A]/90 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-[#050D2A] border border-[#00E7FF]/30 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E7FF]/10 blur-[50px] -mr-16 -mt-16"></div>
            
            <button onClick={() => {setShowModal(false); resetForm();}} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#006AFF]/10 border border-[#006AFF]/20 mb-6 mx-auto relative z-10">
              <ShieldCheck className="w-8 h-8 text-[#00E7FF]" />
            </div>
            
            <h3 className="text-3xl font-bold text-center text-white mb-2 relative z-10">
              {authStep === 1 ? (authMode === 'login' ? 'Welcome Back' : 'Create Account') : 'Verify Identity'}
            </h3>
            <p className="text-center text-slate-400 mb-8 text-sm relative z-10">
              {authStep === 1 
                ? (authMode === 'login' ? 'Sign in to access your risk workspace.' : 'Join FinQuantiX and start predicting.')
                : `We sent a 6-digit code to ${formData.email}.`}
            </p>

            {authStep === 1 ? (
              <form onSubmit={handleInitialSubmit} className="space-y-4 relative z-10">
                {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center animate-shake">{error}</div>}
                
                {authMode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#00E7FF] focus:ring-1 focus:ring-[#00E7FF]/30 transition-all"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Surname</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#00E7FF] focus:ring-1 focus:ring-[#00E7FF]/30 transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Gmail Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#00E7FF] focus:ring-1 focus:ring-[#00E7FF]/30 transition-all"
                      placeholder="analyst@gmail.com"
                    />
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="password" name="password" required value={formData.password} onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-[#00E7FF] focus:ring-1 focus:ring-[#00E7FF]/30 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0055FF] to-[#0088FF] hover:from-[#006AFF] hover:to-[#00A9FF] text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,85,255,0.3)] hover:shadow-[0_0_30px_rgba(0,231,255,0.4)] hover:-translate-y-0.5 flex justify-center items-center group disabled:opacity-70"
                >
                  {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (authMode === 'login' ? 'Send Login OTP' : 'Create Account')}
                </button>

                <div className="text-center mt-6">
                  <p className="text-slate-500 text-sm">
                    {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button 
                      type="button" 
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className="ml-2 text-[#00E7FF] hover:text-white font-bold transition-colors"
                    >
                      {authMode === 'login' ? 'Sign Up' : 'Login'}
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10">
                {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center animate-shake">{error}</div>}
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Enter 6-digit Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E7FF]" />
                    <input 
                      type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-5 text-white outline-none focus:border-[#00E7FF] focus:ring-1 focus:ring-[#00E7FF]/30 transition-all text-center text-3xl tracking-[0.4em] font-mono"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#00E7FF] to-[#0055FF] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,231,255,0.3)] hover:shadow-[0_0_40px_rgba(0,231,255,0.5)] transition-all flex justify-center items-center"
                >
                  {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Verify & Complete'}
                </button>
                
                <button type="button" onClick={() => setAuthStep(1)} className="w-full text-sm text-slate-500 hover:text-white transition-colors text-center">
                  Entered wrong email? Go back
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="h-20 bg-[#030820] border-b-2 border-[#006AFF]/20"></nav>}>
      <NavbarContent />
    </Suspense>
  );
}
