"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ShieldCheck, LogOut, X, Sparkles, User, Mail, Lock, KeyRound, MessageSquare, ArrowRight, Activity } from 'lucide-react';

import { API_BASE_URL } from '../utils/api';

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authStep, setAuthStep] = useState(1);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) setAuthStep(2);
      else {
        const data = await res.json();
        setError(data.detail || 'Failed to request code.');
      }
    } catch (err: any) {
      setError(err.name === 'AbortError' ? 'Server timeout.' : 'Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuth(true);
        setShowModal(false);
        localStorage.setItem('finquantix_auth', 'true');
        localStorage.setItem('finquantix_token', data.token);
        localStorage.setItem('finquantix_user', JSON.stringify(data.user));
        window.location.href = '/dashboard?tab=new';
      } else setError('Invalid OTP.');
    } catch (err) {
      setError('Connection error.');
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
    localStorage.removeItem('finquantix_token');
    localStorage.removeItem('finquantix_user');
    window.location.href = '/';
  };

  const NavLink = ({ href, label, activeTab, num }: { href: string, label: string, activeTab?: string, num: string }) => {
    const isActive = pathname === href || (searchParams?.get('tab') === activeTab);
    return (
      <Link 
        href={href} 
        className={`px-5 py-2.5 text-xs font-black transition-all flex items-center gap-2 tracking-widest uppercase ${isActive ? 'text-white text-glow-white' : 'text-slate-400 hover:text-white hover:text-glow-white'}`}
      >
        <span className="opacity-60 font-bold">{num} /</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] py-6 transition-all border-b border-white/15 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/30 transition-all"></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-white uppercase">FIN<span className="text-primary">Q</span></span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center glass-panel px-6 py-2 rounded-full border border-white/5 shadow-2xl">
            <NavLink href="/dashboard?tab=new" activeTab="new" label="Predictor" num="0.1" />
            <NavLink href="/dashboard?tab=whatif" activeTab="whatif" label="What-If" num="0.2" />
            <NavLink href="/dashboard?tab=dashboard" activeTab="dashboard" label="Metrics" num="0.3" />
            <NavLink href="/live-analysis" label="Live Telemetry" num="0.4" />
          </div>

          <div className="flex items-center space-x-6">
            
            {isAuth ? (
              <button onClick={handleLogout} className="px-6 py-3 rounded-xl glow-button-blue text-white text-xs font-bold uppercase tracking-widest">
                Log Out
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {setShowModal(true); setAuthMode('login');}} 
                  className="text-white text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => {setShowModal(true); setAuthMode('signup');}} 
                  className="px-8 py-3 rounded-xl glow-button-blue text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in px-4">
          <div className="glass-panel border-white/10 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(79,70,229,0.2)] max-w-md w-full relative">
            <button onClick={() => {setShowModal(false); resetForm();}} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 mx-auto">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-4xl font-bold text-center text-white mb-2 leading-tight">
              {authStep === 1 ? (authMode === 'login' ? 'Login' : 'Signup') : 'Verify'}
            </h3>
            <p className="text-center text-slate-500 mb-10 text-sm font-medium">
              {authStep === 1 ? 'Enter your details to continue.' : 'Check your inbox for the code.'}
            </p>

            {authStep === 1 ? (
              <form onSubmit={handleInitialSubmit} className="space-y-5">
                {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-bold">{error}</div>}
                <div>
                  <input 
                    type="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary transition-all text-sm font-medium"
                    placeholder="Email Address"
                  />
                </div>
                <button 
                  type="submit" disabled={isLoading}
                  className="w-full glow-button-blue text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center uppercase tracking-widest text-xs"
                >
                  {isLoading ? '...' : (authMode === 'login' ? 'Send OTP' : 'Continue')}
                </button>
                <button 
                  type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="w-full text-center text-slate-500 hover:text-white text-xs font-bold transition-colors mt-4"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <input 
                  type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-white outline-none focus:border-primary transition-all text-center text-3xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  maxLength={6}
                />
                <button 
                  type="submit" disabled={isLoading}
                  className="w-full glow-button-blue text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs flex justify-center items-center"
                >
                  Verify
                </button>
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
    <Suspense fallback={<nav className="h-20"></nav>}>
      <NavbarContent />
    </Suspense>
  );
}
