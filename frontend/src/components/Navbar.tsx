"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Activity, ShieldCheck, LogOut, ChevronRight, X, Sparkles } from 'lucide-react';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authStep, setAuthStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('finquantix_auth') === 'true') {
      setIsAuth(true);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (authStep === 1) {
        const res = await fetch('http://127.0.0.1:8000/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (res.ok) {
          setAuthStep(2);
        } else {
          setError('Failed to send OTP');
        }
      } else {
        const res = await fetch('http://127.0.0.1:8000/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });
        if (res.ok) {
          setIsAuth(true);
          setShowModal(false);
          localStorage.setItem('finquantix_auth', 'true');
          setAuthStep(1);
          setEmail('');
          setOtp('');
          window.location.href = '/dashboard?tab=new';
        } else {
          setError('Invalid OTP. Please try again.');
        }
      }
    } catch (err) {
      setError('Connection error. Is backend running?');
    }
    setIsLoading(false);
  };

  const handleGoogleLoginStep = () => {
    setAuthStep(3);
    setError('');
  };

  const handleGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        setIsAuth(true);
        setShowModal(false);
        localStorage.setItem('finquantix_auth', 'true');
        setAuthStep(1);
        setEmail('');
        setPassword('');
        window.location.href = '/dashboard?tab=new';
      } else {
        setError('Google authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('Connection error. Is backend running?');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('finquantix_auth');
  };

  const NavLink = ({ href, label, activeTab }: { href: string, label: string, activeTab?: string }) => {
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
      <nav className="sticky top-0 z-50 bg-[#060B19]/80 backdrop-blur-xl border-b border-purple-500/30 shadow-[0_4px_30px_rgba(168,85,247,0.15)]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
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
                className="group relative px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-gradient-x hover:scale-105 transition-all duration-500 font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_35px_rgba(79,70,229,0.6)] flex items-center space-x-2 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="tracking-tight">Sign In</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
              {authStep === 1 ? 'Secure Sign In' : authStep === 2 ? 'Verify Identity' : 'Sign in with Google'}
            </h3>
            <p className="text-center text-slate-400 mb-8 text-sm">
              {authStep === 1 ? 'Enter your corporate email to receive a secure OTP.' : 
               authStep === 2 ? `We sent a code to ${email}. Please check your inbox.` :
               'Use your Google account to access FinQuantiX.'}
            </p>

            {authStep === 3 ? (
              <form onSubmit={handleGoogleAuth} className="space-y-5 animate-fade-in">
                {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm text-center">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Gmail Address</label>
                  <input 
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                  <input 
                    type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit" disabled={isLoading}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center space-x-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : 'Sign In with Google'}
                </button>
                <button type="button" onClick={() => setAuthStep(1)} className="w-full text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Back to standard login
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-5">
                {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm text-center animate-fade-in">{error}</div>}
                {authStep === 1 ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Corporate Email</label>
                      <input 
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                        placeholder="analyst@finquantix.com"
                      />
                    </div>
                    <button 
                      type="submit" disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 flex justify-center items-center"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Login (existing user)'}
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-800"></div>
                      <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">or</span>
                      <div className="flex-grow border-t border-slate-800"></div>
                    </div>
                    
                    <button 
                      type="button" onClick={handleGoogleLoginStep} disabled={isLoading}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg border border-slate-700 disabled:opacity-70 flex justify-center items-center space-x-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      <span>Continue with Google</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">One-Time Password</label>
                      <input 
                        type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                        placeholder="••••••"
                        maxLength={6}
                      />
                    </div>
                    <button 
                      type="submit" disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-70 flex justify-center items-center"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Verify & Sign In'}
                    </button>
                  </>
                )}
              </form>
            )}
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
