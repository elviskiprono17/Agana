'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, X, Send, Bot, User, Scale, ShieldCheck, ChevronRight } from 'lucide-react';
import { ContractContext, ChatMessage } from '@/lib/gemini';

interface GeminiBotProps {
  contractContext: ContractContext;
  onAddCustomClause?: (title: string, content: string) => void;
}

export const GeminiBot: React.FC<GeminiBotProps> = ({
  contractContext,
  onAddCustomClause,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hujambo! I am your **Agana AI Legal Copilot** powered by Gemini.\n\nI can answer questions regarding your **${contractContext.title}** (KES ${contractContext.amountKes.toLocaleString()}), explain terms in **English**, **Swahili**, or **Sheng**, and verify compliance with the **Kenya Small Claims Court Act (2016)**.\n\nAsk me anything before you sign!`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          contractContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat request failed');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Samahani! I had a connection hiccup. Under Kenyan Small Claims Court rules, micro-agreements under KES 1,000,000 are summarily enforceable with zero advocate fee restrictions. Please try sending your question again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Eleza kwa Kiswahili / Sheng",
    "Is the Neutral Witness liable?",
    "What if the seller gives a fake IMEI?",
    "How does Small Claims Court recovery work?",
  ];

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-2xl shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">Ask Gemini AI</span>
          <Sparkles className="h-4 w-4 text-amber-200" />
        </button>
      </div>

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[540px] max-h-[85vh] z-50 flex flex-col bg-[#0b0b0b] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-[#121212] border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Scale className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-white">Agana Legal Copilot</h4>
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">Kenya Contract Act (Cap 23) Specialist</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1f1f1f]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Contract Info Banner */}
          <div className="px-3.5 py-1.5 bg-[#161616] border-b border-[#222222] flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 truncate max-w-[220px]">
              {contractContext.title}
            </span>
            <span className="font-semibold text-emerald-400">
              KES {contractContext.amountKes.toLocaleString()}
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex space-x-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="h-6 w-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-600/10'
                      : 'bg-[#151515] border border-[#242424] text-zinc-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-6 w-6 rounded-md bg-[#252525] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex space-x-2 items-center text-zinc-400 text-xs italic">
                <Bot className="h-4 w-4 text-emerald-400 animate-spin" />
                <span>Gemini is analyzing contract clauses...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#0e0e0e] border-t border-[#1c1c1c] overflow-x-auto flex space-x-1.5 scrollbar-none">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#181818] hover:bg-[#222222] border border-[#2b2b2b] text-[10px] text-zinc-300 hover:text-white transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#121212] border-t border-[#222222]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about clauses, warranties, or Kenyan law..."
                className="flex-1 bg-[#0a0a0a] border border-[#262626] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className={`p-2 rounded-xl transition-all ${
                  inputMessage.trim() && !loading
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-[#1a1a1a] text-zinc-600 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
