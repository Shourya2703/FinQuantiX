"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Activity, ShieldCheck, ShieldAlert, DollarSign, Briefcase, User, Percent, LayoutDashboard, Sliders, FileText, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetch('http://127.0.0.1:8000/metrics').then(res => res.json()).then(setMetrics);
      fetch('http://127.0.0.1:8000/history').then(res => res.json()).then(setHistory);
      fetch('http://127.0.0.1:8000/feature-importance').then(res => res.json()).then(data => setFeatureImportance(data.global_feature_importance));
    }
  }, [activeTab]);

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
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
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
          const response = await fetch('http://127.0.0.1:8000/what-if', {
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
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
      <div className={`absolute top-0 left-0 w-full h-1 ${res.approved ? 'bg-[#00E7FF]' : 'bg-rose-500'}`}></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-bold flex items-center">
              {res.approved ? <><ShieldCheck className="w-8 h-8 mr-3 text-[#00E7FF]" /> <span className="text-[#00F0FF]">Approved</span></> : <><ShieldAlert className="w-8 h-8 mr-3 text-rose-500" /> <span className="text-rose-400">High Risk</span></>}
            </h2>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-sm font-mono text-slate-300 shadow-inner">
              Base: {res.base_value.toFixed(2)}
            </div>
          </div>
          <div className="ml-11 flex items-center justify-between mt-2 text-sm text-slate-400 bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
            <div>Approval Prob: <span className="text-slate-200 font-bold ml-1">{((1 - res.risk_probability) * 100).toFixed(1)}%</span></div>
            <div>Risk Level: <span className={`font-bold ml-1 ${res.risk_level === 'High' ? 'text-rose-400' : res.risk_level === 'Medium' ? 'text-amber-400' : 'text-[#00F0FF]'}`}>{res.risk_level}</span></div>
          </div>
          <div className="ml-11 mt-2">
            <ConfidenceIndicator confidence={res.confidence} />
          </div>
        </div>
      </div>
      
      {res.natural_language_explanation && res.natural_language_explanation.length > 0 && (
        <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Drivers</h4>
          <ul className="space-y-2">
            {res.natural_language_explanation.map((text: string, idx: number) => (
              <li key={idx} className="flex items-start text-sm text-slate-300">
                <ArrowRight className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${text.includes('High risk factor') ? 'text-rose-500' : 'text-[#00E7FF]'}`} />
                <span>{text.replace('High risk factor: ', '').replace('Low risk factor: ', '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#03091A] text-slate-100 font-sans selection:bg-[#006AFF]/30 overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay fixed"></div>
      <div className="fixed top-0 -left-1/4 w-[50%] h-[50%] bg-[#000E75] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="fixed bottom-0 -right-1/4 w-[50%] h-[50%] bg-[#000E75] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none"></div>

      {/* Navigation handled by layout.tsx Navbar */}
      <main className="container mx-auto px-4 py-10 relative z-10 max-w-7xl">
        
        {/* PREDICTOR TAB */}
        {activeTab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0b0f1a] to-[#0f172a] backdrop-blur-md border border-[#0088FF]/20 rounded-3xl p-8 shadow-[0_0_15px_rgba(0,136,255,0.15)] hover:border-[#0088FF]/40 hover:shadow-[0_0_30px_rgba(0,136,255,0.25)] transition-all duration-500">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-slate-200 border-b border-white/5 pb-4">
                <User className="w-5 h-5 mr-2 text-[#00A9FF]" /> Applicant Profile
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {renderFormFields(formData, handleChange)}
                <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-[#0055FF] to-[#0066FF] hover:from-[#006AFF] hover:to-[#0088FF] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,106,255,0.3)] hover:shadow-xl hover:scale-[1.02] flex justify-center items-center">
                  {loading ? <span className="animate-pulse">Analyzing Risk...</span> : 'Run Risk Analysis'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">{error}</div>}
              {!result && !error && (
                <div className="h-full min-h-[400px] border border-[#0088FF]/20 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-slate-900/40 shadow-[0_0_15px_rgba(0,136,255,0.05)]">
                  <Activity className="w-16 h-16 mb-5 opacity-40 text-[#00A9FF]" />
                  <p className="text-xl font-semibold tracking-wide">Fill out the profile to view AI analysis.</p>
                </div>
              )}
              {result && (
                <>
                  {renderResultPanel(result)}
                  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-[#00A9FF]" /> Feature Contributions (SHAP)
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
              <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl relative">
                {whatIfLoading && (
                  <div className="absolute top-4 right-4 flex items-center">
                    <div className="w-2 h-2 bg-[#006AFF] rounded-full animate-ping"></div>
                    <span className="text-xs text-[#00A9FF] ml-2 font-medium">Updating</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-6 flex items-center text-slate-200">Parameters</h3>
                <form className="space-y-4">
                  {renderFormFields(whatIfData, handleWhatIfChange)}
                </form>
              </div>
              <div className="lg:col-span-8">
                {whatIfResult ? (
                  <div className="space-y-6">
                    {renderResultPanel(whatIfResult)}
                    
                    {/* Simplified Comparison/Feature view */}
                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-slate-900/40 backdrop-blur-md border border-emerald-900/30 rounded-3xl p-6">
                         <h4 className="text-sm font-semibold text-[#00F0FF] mb-4">Top Positive Factors (Lower Risk)</h4>
                         {whatIfResult.top_negative_contributors.map((c: any, i: number) => (
                           <div key={i} className="mb-3">
                             <div className="flex justify-between text-xs text-slate-300 mb-1">
                               <span>{c.feature} ({c.value})</span>
                               <span className="text-[#00F0FF]">{c.contribution.toFixed(3)}</span>
                             </div>
                             <div className="w-full bg-slate-800 rounded-full h-1"><div className="bg-[#00E7FF] h-1 rounded-full" style={{width: `${Math.min(100, Math.abs(c.contribution)*1000)}%`}}></div></div>
                           </div>
                         ))}
                       </div>
                       <div className="bg-slate-900/40 backdrop-blur-md border border-rose-900/30 rounded-3xl p-6">
                         <h4 className="text-sm font-semibold text-rose-400 mb-4">Top Negative Factors (Increase Risk)</h4>
                         {whatIfResult.top_positive_contributors.map((c: any, i: number) => (
                           <div key={i} className="mb-3">
                             <div className="flex justify-between text-xs text-slate-300 mb-1">
                               <span>{c.feature} ({c.value})</span>
                               <span className="text-rose-400">+{c.contribution.toFixed(3)}</span>
                             </div>
                             <div className="w-full bg-slate-800 rounded-full h-1"><div className="bg-rose-500 h-1 rounded-full" style={{width: `${Math.min(100, c.contribution*1000)}%`}}></div></div>
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
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-center hover:border-[#006AFF]/30 hover:shadow-[0_0_20px_rgba(0,106,255,0.15)] transition-all duration-300">
                  <div className="text-sm text-slate-400 font-medium mb-1">Model Accuracy</div>
                  <div className="text-4xl font-bold text-[#00A9FF]">{(metrics.accuracy * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-500 mt-2">Test set performance</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-center hover:border-[#0088FF]/30 hover:shadow-[0_0_20px_rgba(0,136,255,0.15)] transition-all duration-300">
                  <div className="text-sm text-slate-400 font-medium mb-1">ROC AUC Score</div>
                  <div className="text-4xl font-bold text-[#00A9FF]">{metrics.roc_auc.toFixed(3)}</div>
                  <div className="text-xs text-slate-500 mt-2">Discriminative power</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-center hover:border-[#00E7FF]/30 hover:shadow-[0_0_20px_rgba(0,169,255,0.15)] transition-all duration-300">
                  <div className="text-sm text-slate-400 font-medium mb-1">Predictions Today</div>
                  <div className="text-4xl font-bold text-[#00F0FF]">{history.length}</div>
                  <div className="text-xs text-slate-500 mt-2">In-memory session tracking</div>
                </div>
              </div>
            ) : <div className="animate-pulse flex space-x-4"><div className="h-32 bg-slate-800 rounded-xl w-full"></div></div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {metrics?.roc_curve && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-semibold text-slate-300 mb-6">ROC Curve</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.roc_curve} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="fpr" type="number" stroke="#475569" fontSize={11} domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
                        <YAxis dataKey="tpr" type="number" stroke="#475569" fontSize={11} domain={[0, 1]} tickFormatter={(val) => val.toFixed(1)} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                        <Line type="monotone" dataKey="tpr" stroke="#00E7FF" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              
              {featureImportance.length > 0 && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-sm font-semibold text-slate-300 mb-6">Global Feature Importance (Random Forest)</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportance.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="feature" type="category" width={100} stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }} />
                        <Bar dataKey="importance" fill="#006AFF" radius={[0, 4, 4, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden hover:border-slate-700 transition-colors">
              <h3 className="text-sm font-semibold text-slate-300 mb-6">Recent Prediction History</h3>
              {history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="text-xs uppercase bg-slate-950/50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Age</th>
                        <th className="px-4 py-3">Income</th>
                        <th className="px-4 py-3">Credit</th>
                        <th className="px-4 py-3">DTI</th>
                        <th className="px-4 py-3">Loan Amt</th>
                        <th className="px-4 py-3">Prob</th>
                        <th className="px-4 py-3">Confidence</th>
                        <th className="px-4 py-3 rounded-tr-lg">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice(0, 10).map((h: any, i: number) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="px-4 py-3">{h.input.age}</td>
                          <td className="px-4 py-3">${h.input.income}</td>
                          <td className="px-4 py-3">{h.input.credit_history}</td>
                          <td className="px-4 py-3">{h.input.debt_to_income_ratio}</td>
                          <td className="px-4 py-3">${h.input.loan_amount}</td>
                          <td className="px-4 py-3">{(h.result.risk_probability * 100).toFixed(1)}%</td>
                          <td className="px-4 py-3">{(h.result.confidence * 100).toFixed(0)}%</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${h.result.approved ? 'bg-[#00E7FF]/20 text-[#00F0FF]' : 'bg-rose-500/20 text-rose-400'}`}>
                              {h.result.approved ? 'Approve' : 'Deny'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">No predictions recorded yet.</div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#03091A] flex items-center justify-center text-[#00A9FF]">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
