"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Activity, Users, AlertTriangle, TrendingUp, Globe } from 'lucide-react';

export default function LiveAnalysis() {
  const [data, setData] = useState<any[]>([]);
  const [currentDefaults, setCurrentDefaults] = useState(1243);
  const [riskTrend, setRiskTrend] = useState<number>(0);

  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 3000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
      defaultRate: 4.5 + Math.random() * 1.5,
      applications: 100 + Math.floor(Math.random() * 50)
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newRate = 4.5 + Math.random() * 1.5 + (Math.sin(Date.now() / 10000) * 0.5);
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
          defaultRate: newRate,
          applications: 100 + Math.floor(Math.random() * 50)
        }];
        
        setRiskTrend(parseFloat((newRate - prev[prev.length - 1].defaultRate).toFixed(2)));
        if (Math.random() > 0.5) setCurrentDefaults(curr => curr + Math.floor(Math.random() * 3));
        
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const regionalData = [
    { name: 'North America', risk: 4.2 },
    { name: 'Europe', risk: 3.8 },
    { name: 'Asia Pacific', risk: 5.1 },
    { name: 'Latin America', risk: 6.4 },
    { name: 'Middle East', risk: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay fixed"></div>
      <div className="fixed top-0 -left-1/4 w-[50%] h-[50%] bg-indigo-900 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-0 -right-1/4 w-[50%] h-[50%] bg-purple-900 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Activity className="w-8 h-8 mr-3 text-emerald-400" /> 
            Global Live Analysis
          </h1>
          <p className="text-slate-400 mt-2">Real-time telemetry of global credit risk models.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full animate-pulse-slow">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-medium text-emerald-400">System Online (Streaming)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Users className="w-16 h-16" /></div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Simulated High-Risk Users</h3>
          <div className="text-5xl font-bold text-white">{currentDefaults.toLocaleString()}</div>
          <div className="text-sm text-slate-500 mt-2">Currently flagged in global pool</div>
        </div>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><AlertTriangle className="w-16 h-16" /></div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Current Avg Default Rate</h3>
          <div className="text-5xl font-bold text-amber-400">
            {data.length > 0 ? data[data.length - 1].defaultRate.toFixed(2) : '0.00'}%
          </div>
          <div className={`text-sm mt-2 flex items-center ${riskTrend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {riskTrend > 0 ? '↑' : '↓'} {Math.abs(riskTrend)}% from last tick
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp className="w-16 h-16" /></div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Throughput (Apps/sec)</h3>
          <div className="text-5xl font-bold text-indigo-400">
            {data.length > 0 ? (data[data.length - 1].applications / 3).toFixed(0) : '0'}
          </div>
          <div className="text-sm text-slate-500 mt-2">Global API inference requests</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-400" /> Real-Time Default Rate Trend
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickMargin={10} minTickGap={20} />
                <YAxis stroke="#64748b" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={val => val.toFixed(1) + '%'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fcd34d' }}
                />
                <Area type="monotone" dataKey="defaultRate" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-400" /> Regional Risk Heat
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="name" type="category" width={90} stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}} 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} 
                  formatter={(val: any) => [Number(val).toFixed(1) + '%', 'Avg Risk']}
                />
                <Bar dataKey="risk" radius={[0, 4, 4, 0]} barSize={24}>
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.risk > 5 ? '#ef4444' : entry.risk > 4 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">Data simulated for demonstration purposes.</p>
        </div>
      </div>
      </div>
    </div>
  );
}
