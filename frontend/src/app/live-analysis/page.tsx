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
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Activity className="w-10 h-10 text-primary" /> 
              Global Live Analysis
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Real-time telemetry of global credit risk models.</p>
          </div>
          <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full self-start">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Streaming</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass-panel glass-glow rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-24 h-24" /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">High-Risk Users</h3>
            <div className="text-5xl font-bold text-white">{currentDefaults.toLocaleString()}</div>
            <div className="text-xs text-slate-600 mt-4 font-medium uppercase tracking-wider">Flagged in pool</div>
          </div>
          
          <div className="glass-panel glass-glow rounded-[2rem] p-8 relative overflow-hidden group border-orange-500/20">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><AlertTriangle className="w-24 h-24" /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Avg Default Rate</h3>
            <div className="text-5xl font-bold text-orange-500">
              {data.length > 0 ? data[data.length - 1].defaultRate.toFixed(2) : '0.00'}%
            </div>
            <div className={`text-xs mt-4 flex items-center font-bold uppercase tracking-wider ${riskTrend > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {riskTrend > 0 ? '↑' : '↓'} {Math.abs(riskTrend)}% Delta
            </div>
          </div>

          <div className="glass-panel glass-glow rounded-[2rem] p-8 relative overflow-hidden group border-primary/20">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="w-24 h-24" /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Throughput</h3>
            <div className="text-5xl font-bold text-primary">
              {data.length > 0 ? (data[data.length - 1].applications / 3).toFixed(0) : '0'}
            </div>
            <div className="text-xs text-slate-600 mt-4 font-medium uppercase tracking-wider">Apps / Second</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 glass-panel glass-glow rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" /> Live Trend
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickMargin={10} minTickGap={20} />
                  <YAxis stroke="#475569" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={val => val.toFixed(1) + '%'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                  <Area type="monotone" dataKey="defaultRate" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel glass-glow rounded-[2rem] p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" /> Regional Risk
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                  />
                  <Bar dataKey="risk" radius={[0, 8, 8, 0]} barSize={24}>
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.risk > 5 ? '#f43f5e' : entry.risk > 4 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-600 mt-8 text-center font-medium uppercase tracking-widest">Telemetry active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
