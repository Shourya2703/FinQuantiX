"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const QA_DATABASE = [
  { keywords: ['dti', 'debt to income', 'ratio'], answer: "DTI (Debt-to-Income ratio) is the percentage of your gross monthly income that goes to paying your monthly debt payments. Lenders use it to determine your borrowing risk. A lower DTI indicates a good balance between debt and income." },
  { keywords: ['roc', 'auc', 'curve'], answer: "The ROC curve (Receiver Operating Characteristic) shows the performance of a classification model. AUC (Area Under the Curve) measures the entire two-dimensional area underneath the ROC curve. An AUC of 1.0 represents a perfect model, while 0.5 represents a random guess." },
  { keywords: ['credit score', 'history', 'score'], answer: "A credit score is a numerical expression based on a level analysis of a person's credit files, to represent the creditworthiness of an individual. Scores range from 300 to 850. Higher scores indicate lower risk for lenders." },
  { keywords: ['probability', 'approval', 'meaning'], answer: "Approval probability is the model's confidence that a loan will be repaid without default. In FinQuantiX, we use a 50% threshold: above 50% risk is usually Denied, while below 50% is likely Approved." },
  { keywords: ['shap', 'explain', 'why'], answer: "SHAP (SHapley Additive exPlanations) is a method to explain individual predictions. It breaks down a model's decision into the exact contribution of each feature (like income or age), showing exactly why the model chose its result." },
  { keywords: ['finquantix', 'engine'], answer: "FinQuantiX is a state-of-the-art credit risk engine that combines Logistic Regression with SHAP explainability to provide transparent, data-driven financial decisions." }
];

const SUGGESTED_QUESTIONS = [
  "What is DTI?",
  "What is credit score?",
  "What is ROC curve?",
  "What is SHAP?"
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your FinQuantiX Assistant. How can I help you understand your risk analysis today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');

    // Process answer
    setTimeout(() => {
      const query = text.toLowerCase();
      let foundAnswer = null;

      for (const item of QA_DATABASE) {
        if (item.keywords.some(k => query.includes(k))) {
          foundAnswer = item.answer;
          break;
        }
      }

      const botResponse = foundAnswer || "I can explain financial and ML terms like DTI, credit score, ROC curve, and SHAP. Try asking about those!";
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl ${isOpen ? 'bg-rose-500 rotate-90 scale-90' : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-110 shadow-indigo-500/20'}`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-slate-950 border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-5 bg-indigo-600/10 border-b border-indigo-500/20 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">FinQuantiX Assistant</h3>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider">AI Explainer Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Suggested Topics</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(q)}
                      className="text-xs px-3 py-2 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
              className="relative flex items-center"
            >
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me a question..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors pr-12"
              />
              <button 
                type="submit"
                className="absolute right-2 p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
