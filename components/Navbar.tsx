'use client';

import React from 'react';
import { Scale, PlusCircle } from 'lucide-react';
import Image from 'next/image';

interface NavbarProps {
  onNewDeal?: () => void;
  activeStep?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewDeal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Uploaded Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewDeal}>
          <div className="h-9 w-9 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-zinc-900 shadow-sm">
            <img
              src="/logo.jpg"
              alt="Agana Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xl tracking-tight text-zinc-950">AGANA</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                KENYA
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 hidden sm:block">
              Biometric Micro-Agreements & Informal Dispute Protection
            </p>
          </div>
        </div>

        {/* Small Claims Court Badge & Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs text-zinc-700">
            <Scale className="h-3.5 w-3.5 text-zinc-900" />
            <span>Small Claims Cap:</span>
            <span className="font-bold text-zinc-950">KES 1,000,000</span>
          </div>

          <button
            onClick={onNewDeal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black hover:bg-zinc-800 text-white transition-all shadow-sm active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Agreement</span>
          </button>
        </div>
      </div>
    </header>
  );
};
