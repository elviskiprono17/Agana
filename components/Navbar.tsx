'use client';

import React from 'react';
import { ShieldCheck, Scale, Sparkles, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onNewDeal?: () => void;
  activeStep?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewDeal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f1f1f] bg-[#080808]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewDeal}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="h-full w-full bg-[#0d0d0d] rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">AGANA</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                KENYA
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                YC W27 MVP
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Biometric Micro-Agreements & Instant Informal Dispute Protection
            </p>
          </div>
        </div>

        {/* Small Claims Court Badge & Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#242424] text-xs text-zinc-300">
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>Small Claims Cap:</span>
            <span className="font-bold text-emerald-400">KES 1,000,000</span>
          </div>

          <button
            onClick={onNewDeal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Agreement</span>
          </button>
        </div>
      </div>
    </header>
  );
};
