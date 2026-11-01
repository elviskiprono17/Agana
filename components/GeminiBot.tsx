'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Scale } from 'lucide-react';
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
      content: `Hujambo! I am your **Agana AI Legal Copilot** powered by Gemini.\n\nI can answer questions regarding your **${contractContext?.title || 'contract'}** (KES ${(Number(contractContext?.amountKes) || 0).toLocaleString()}), explain terms in **English**, **Swahili**, or **Sheng**, and verify compliance with the **Kenya Small Claims Court Act (2016)**.\n\nAsk me anything before or after signing!`,
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
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

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
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Under Kenyan Small Claims Court rules (Cap 23), micro-agreements under KES 1,000,000 are summarily enforceable. If you have any questions regarding clauses or witness neutrality, ask and I will guide you immediately.',
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
      {/* Floating trigger button - strictly the Bot icon, no text, no stars */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-14 w-14 rounded-full bg-black hover:bg-zinc-800 text-white shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border-2 border-zinc-900 cursor-pointer"
          title="Agana AI Legal Copilot"
          aria-label="Toggle AI Bot"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
        </button>
      </div>

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[520px] max-h-[80vh] z-50 flex flex-col bg-white border border-zinc-300 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-white border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <Scale className="h-4 w-4 text-zinc-900" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-zinc-950">Agana Legal Copilot</h4>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">Kenya Contract Act (Cap 23) Specialist</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Contract Info Banner */}
          <div className="px-3.5 py-1.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-[11px]">
            <span className="text-zinc-600 truncate max-w-[220px]">
              {contractContext?.title || 'Contract Analysis'}
            </span>
            <span className="font-bold text-zinc-950 font-mono">
              KES {(Number(contractContext?.amountKes) || 0).toLocaleString()}
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex space-x-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role !== 'user' && (
                  <div className="h-6 w-6 rounded-md bg-zinc-200 border border-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-zinc-900" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-zinc-200 text-zinc-900 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-6 w-6 rounded-md bg-zinc-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-zinc-200" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex space-x-2 items-center text-zinc-500 text-xs italic">
                <Bot className="h-4 w-4 text-zinc-900 animate-spin" />
                <span>Gemini is analyzing contract clauses...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-zinc-200 overflow-x-auto flex space-x-1.5 scrollbar-none">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-[10px] text-zinc-800 font-medium transition-all shrink-0 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-zinc-200">
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
                className="flex-1 bg-zinc-50 border border-zinc-300 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  inputMessage.trim() && !loading
                    ? 'bg-black hover:bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
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
