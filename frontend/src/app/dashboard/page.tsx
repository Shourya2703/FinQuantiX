"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Activity, ShieldCheck, ShieldAlert, DollarSign, Briefcase, User, Percent, LayoutDashboard, Sliders, FileText, ArrowRight, Lock } from 'lucide-react';
import { API_BASE_URL } from '@/utils/api';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'new');

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  const [formData, setFormData] = useState({
    age: '30',
    income: '65000',
    employment_type: 'Employed',
    credit_history: '700',
    existing_loans: '1',
    debt_to_income_ratio: '0.3',
    loan_amount: '20000',
    loan_term: '36'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [whatIfData, setWhatIfData] = useState({ ...formData });
  const [whatIfResult, setWhatIfResult] = useState<any>(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);

  const [metrics, setMetrics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [featureImportance, setFeatureImportance] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('finquantix_token');
    const authStatus = localStorage.getItem('finquantix_auth') === 'true';
    setIsAuth(authStatus);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/metrics`).then(res => res.json()).then(setMetrics);
    fetch(`${API_BASE_URL}/feature-importance`).then(res => res.json()).then(data => setFeatureImportance(data.global_feature_importance));

    if (isAuth && token) {
      fetch(`${API_BASE_URL}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()).then(setHistory);
    }
  }, [activeTab, isAuth, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age), income: parseFloat(formData.income),
        credit_history: parseInt(formData.credit_history), existing_loans: parseInt(formData.existing_loans),
        debt_to_income_ratio: parseFloat(formData.debt_to_income_ratio), loan_amount: parseFloat(formData.loan_amount),
        loan_term: parseInt(formData.loan_term)
      };
      const token = localStorage.getItem('finquantix_token');
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to predict risk');
      const data = await response.json();
      setResult(data);
      setWhatIfData(formData);
      setWhatIfResult(data);    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleWhatIfChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newData = { ...whatIfData, [e.target.name]: e.target.value };
    setWhatIfData(newData);
  };

  useEffect(() => {
    if (activeTab === 'whatif') {
      const timeoutId = setTimeout(async () => {
        setWhatIfLoading(true);
        try {
          const payload = {
            ...whatIfData,
            age: parseInt(whatIfData.age), income: parseFloat(whatIfData.income),
            credit_history: parseInt(whatIfData.credit_history), existing_loans: parseInt(whatIfData.existing_loans),
            debt_to_income_ratio: parseFloat(whatIfData.debt_to_income_ratio), loan_amount: parseFloat(whatIfData.loan_amount),
            loan_term: parseInt(whatIfData.loan_term)
          };
          const response = await fetch(`${API_BASE_URL}/what-if`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
          });
          if (response.ok) setWhatIfResult(await response.json());
        } catch (e) { } finally { setWhatIfLoading(false); }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [whatIfData, activeTab]);

  const ConfidenceIndicator = ({ confidence }: { confidence: number }) => (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Model Confidence</span>
        <span>{(confidence * 100).toFixed(0)}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-[#006AFF] h-1.5 rounded-full transition-all duration-500" 
          style={{ width: `${confidence * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderFormFields = (data: any, onChange: any) => (
    <>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Age</label>
          <input type="number" name="age" value={data.age} onChange={onChange} required min="18" max="100" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Employment</label>
          <select name="employment_type" value={data.employment_type} onChange={onChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300">
            <option value="Employed">Employed</option><option value="Self-Employed">Self-Employed</option><option value="Unemployed">Unemployed</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Annual Income</label>
          <input type="number" name="income" value={data.income} onChange={onChange} required min="0" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Credit Score</label>
          <input type="number" name="credit_history" value={data.credit_history} onChange={onChange} required min="300" max="850" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Existing Loans</label>
          <input type="number" name="existing_loans" value={data.existing_loans} onChange={onChange} required min="0" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center"><Percent className="w-3 h-3 mr-1" /> DTI Ratio</label>
          <input type="number" name="debt_to_income_ratio" value={data.debt_to_income_ratio} onChange={onChange} required min="0" max="1" step="0.01" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Loan Amount</label>
          <input type="number" name="loan_amount" value={data.loan_amount} onChange={onChange} required min="100" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Loan Term</label>
          <select name="loan_term" value={data.loan_term} onChange={onChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none hover:border-[#00A9FF]/40 focus:ring-2 focus:ring-[#0088FF] focus:border-[#0088FF] focus:shadow-[0_0_10px_rgba(0,136,255,0.3)] transition-all duration-300">
            <option value="12">12 Months</option><option value="24">24 Months</option><option value="36">36 Months</option><option value="48">48 Months</option><option value="60">60 Months</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderResultPanel = (res: any) => (
    <div className="glass-panel glass-glow p-8 rounded-[2rem] relative overflow-hidden animate-fade-in-up">
      <div className={`absolute top-0 left-0 w-full h-1.5 ${res.approved ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold flex items-center">
              {res.approved ? <><ShieldCheck className="w-8 h-8 mr-3 text-emerald-400" /> <span className="text-emerald-400">Approved</span></> : <><ShieldAlert className="w-8 h-8 mr-3 text-rose-500" /> <span className="text-rose-400">High Risk</span></>}
            </h2>
            <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-sm font-mono text-slate-400">
              Base: {res.base_value.toFixed(2)}
            </div>
          </div>
          <div className="ml-11 flex items-center justify-between mt-2 text-sm text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
            <div>Approval Prob: <span className="text-white font-bold ml-1">{((1 - res.risk_probability) * 100).toFixed(1)}%</span></div>
            <div>Risk Level: <span className={`font-bold ml-1 ${res.risk_level === 'High' ? 'text-rose-400' : res.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{res.risk_level}</span></div>
          </div>
          <div className="ml-11 mt-2">
            <ConfidenceIndicator confidence={res.confidence} />
          </div>
        </div>
      </div>
      
      {res.natural_language_explanation && res.natural_language_explanation.length > 0 && (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Drivers</h4>
          <ul className="space-y-2">
            {res.natural_language_explanation.map((text: string, idx: number) => (
              <li key={idx} className="flex items-start text-sm text-slate-300">
                <ArrowRight className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${text.includes('High risk factor') ? 'text-rose-500' : 'text-primary'}`} />
                <span>{text.replace('High risk factor: ', '').replace('Low risk factor: ', '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">

      {/* Navigation handled by layout.tsx Navbar */}
      <main className="container mx-auto px-4 py-10 relative z-10 max-w-7xl">
        
        {/* PREDICTOR TAB */}
        {activeTab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5 glass-panel glass-glow rounded-[2rem] p-8 group transition-all">
              <h2 className="text-xl font-bold mb-6 flex items-center text-white border-b border-white/5 pb-4">
                <User className="w-5 h-5 mr-2 text-primary" /> Applicant Profile
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {renderFormFields(formData, handleChange)}
                {isClient && isAuth ? (
                  <button type="submit" disabled={loading} className="w-full mt-6 bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/25 flex justify-center items-center">
                    {loading ? <span className="animate-pulse">Analyzing Risk...</span> : 'Run Risk Analysis'}
                  </button>
                ) : isClient ? (
                  <div className="mt-6 p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                    <p className="text-sm text-primary font-bold mb-2">Authentication Required</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Please sign in to run predictions and save history.</p>
                  </div>
                ) : (
                  <div className="h-12 bg-white/5 rounded-2xl animate-pulse"></div>
                )}
              </form>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl">{error}</div>}
              {!result && !error && (
                <div className="h-full min-h-[400px] border border-white/5 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-slate-500 glass-panel">
                  <Activity className="w-16 h-16 mb-5 opacity-40 text-primary" />
                  <p className="text-xl font-bold">Fill out the profile to view AI analysis.</p>
                </div>
              )}
              {result && (
                <>
                  {renderResultPanel(result)}
                  <div className="glass-panel glass-glow rounded-[2rem] p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-primary" /> Feature Contributions (SHAP)
                    </h3>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.explanation.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                          <XAxis type="number" stroke="#475569" fontSize={11} />
                          <YAxis dataKey="feature" type="category" width={110} stroke="#94a3b8" fontSize={11} tick={{ fill: '#94a3b8' }} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
                          <Bar dataKey="contribution" radius={[0, 4, 4, 0]} barSize={20}>
                            {result.explanation.slice(0, 6).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#f43f5e' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* WHAT-IF SIMULATOR TAB */}
        {activeTab === 'whatif' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-3">Live Risk Simulator</h2>
              <p className="text-slate-400 text-sm">Adjust parameters to see how they impact the risk model in real-time. Useful for finding the exact threshold for loan approval.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 glass-panel glass-glow rounded-[2rem] p-6 relative">
                {whatIfLoading && (
                  <div className="absolute top-4 right-4 flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                    <span className="text-xs text-primary ml-2 font-bold">Updating</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-6 flex items-center text-white">Parameters</h3>
                <form className="space-y-4">
                  {renderFormFields(whatIfData, handleWhatIfChange)}
                </form>
              </div>
              <div className="lg:col-span-8">
                {whatIfResult ? (
                  <div className="space-y-6">
                    {renderResultPanel(whatIfResult)}
                    
                    {/* Simplified Comparison/Feature view */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="glass-panel border-emerald-500/20 rounded-[2rem] p-6">
                         <h4 className="text-sm font-bold text-emerald-400 mb-4">Top Positive Factors (Lower Risk)</h4>
                         {whatIfResult.top_negative_contributors.map((c: any, i: number) => (
                           <div key={i} className="mb-3">
                             <div className="flex justify-between text-xs text-slate-300 mb-1">
                               <span>{c.feature} ({c.value})</span>
                               <span className="text-emerald-400">{c.contribution.toFixed(3)}</span>
                             </div>
                             <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${Math.min(100, Math.abs(c.contribution)*1000)}%`}}></div></div>
                           </div>
                         ))}
                       </div>
                       <div className="glass-panel border-rose-500/20 rounded-[2rem] p-6">
                         <h4 className="text-sm font-bold text-rose-400 mb-4">Top Negative Factors (Increase Risk)</h4>
                         {whatIfResult.top_positive_contributors.map((c: any, i: number) => (
                           <div key={i} className="mb-3">
                             <div className="flex justify-between text-xs text-slate-300 mb-1">
                               <span>{c.feature} ({c.value})</span>
                               <span className="text-rose-400">+{c.contribution.toFixed(3)}</span>
                             </div>
                             <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-rose-500 h-1.5 rounded-full" style={{width: `${Math.min(100, c.contribution*1000)}%`}}></div></div>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[400px] border border-slate-800/50 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-500 bg-slate-900/20">
                    Run an initial prediction first or adjust fields to simulate.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-8">
            {metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel glass-glow rounded-[2rem] p-6 flex flex-col justify-center hover:border-primary/50 transition-all">
                  <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-widest">Model Accuracy</div>
                  <div className="text-4xl font-bold text-primary">{(metrics.accuracy * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-500 mt-2">Test set performance</div>
                </div>
                <div className="glass-panel glass-glow rounded-[2rem] p-6 flex flex-col justify-center hover:border-primary/50 transition-all">
                  <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-widest">ROC AUC Score</div>
                  <div className="text-4xl font-bold text-primary">{metrics.roc_auc.toFixed(3)}</div>
                  <div className="text-xs text-slate-500 mt-2">Discriminative power</div>
                </div>
                <div className="glass-panel glass-glow rounded-[2rem] p-6 flex flex-col justify-center hover:border-primary/50 transition-all">
                  <div className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-widest">Predictions Today</div>
                  <div className="text-4xl font-bold text-white">{history.length}</div>
                  <div className="text-xs text-slate-500 mt-2">In-memory session tracking</div>
                </div>
              </div>
            ) : <div className="animate-pulse flex space-x-4"><div className="h-32 bg-white/5 rounded-[2rem] w-full"></div></div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {metrics?.roc_curve && (
                <div className="glass-panel glass-glow rounded-[2rem] p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">ROC Curve</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.roc_curve} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="fpr" type="number" stroke="#475569" fontSize={11} domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
                        <YAxis dataKey="tpr" type="number" stroke="#475569" fontSize={11} domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }} />
                        <Line type="monotone" dataKey="tpr" stroke="var(--primary)" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: 'var(--primary)' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {featureImportance.length > 0 && (
                <div className="glass-panel glass-glow rounded-[2rem] p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Global Feature Importance</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportance.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="feature" type="category" width={100} stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', fontSize: '12px' }} />
                        <Bar dataKey="importance" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-panel glass-glow rounded-[2rem] p-6 overflow-hidden">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Recent Prediction History</h3>
              {isClient && isAuth ? (
                history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead className="text-xs uppercase bg-white/5 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-2xl">Age</th>
                          <th className="px-4 py-3">Income</th>
                          <th className="px-4 py-3">Credit</th>
                          <th className="px-4 py-3">DTI</th>
                          <th className="px-4 py-3">Loan Amt</th>
                          <th className="px-4 py-3">Prob</th>
                          <th className="px-4 py-3">Confidence</th>
                          <th className="px-4 py-3 rounded-tr-2xl">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.slice(0, 10).map((h: any, i: number) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">{h.input.age}</td>
                            <td className="px-4 py-3">${h.input.income}</td>
                            <td className="px-4 py-3">{h.input.credit_history}</td>
                            <td className="px-4 py-3">{h.input.debt_to_income_ratio}</td>
                            <td className="px-4 py-3">${h.input.loan_amount}</td>
                            <td className="px-4 py-3">{(h.result.risk_probability * 100).toFixed(1)}%</td>
                            <td className="px-4 py-3">{(h.result.confidence * 100).toFixed(0)}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${h.result.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {h.result.approved ? 'Approve' : 'Deny'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-sm italic font-medium">No predictions recorded yet.</div>
                )
              ) : isClient ? (
                <div className="text-center py-16 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                  <Lock className="w-10 h-10 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold mb-2">Sign in to view your prediction history</p>
                  <p className="text-xs text-slate-600">Your risk assessments are secure and private.</p>
                </div>
              ) : (
                <div className="h-32 bg-white/5 animate-pulse rounded-[2rem]"></div>
              )}
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
