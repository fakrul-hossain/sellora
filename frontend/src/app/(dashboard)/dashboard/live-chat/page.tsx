'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, Headphones, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-context';

export default function LiveChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: `Hello ${user?.name || 'there'}! Welcome to Sellora Customer Support. How can we assist you today with your orders, shipping, or payments?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: 'user', text: inputText, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Thank you for reaching out! A Sellora customer representative is reviewing your inquiry and will reply shortly.',
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-brand-primary" />
          <span>Sellora Support Live Chat</span>
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Headphones className="w-4 h-4" />
          <span>Support Online</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md p-4 rounded-2xl text-xs space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-brand-primary text-white font-medium rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 font-medium border border-slate-200/80 rounded-bl-none shadow-2xs'
                }`}
              >
                <p>{m.text}</p>
                <span className={`text-[10px] block text-right ${m.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl py-3 px-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            className="p-3 rounded-2xl bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
