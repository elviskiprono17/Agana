'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DealWizard } from '@/components/DealWizard';
import {
  ShieldCheck,
  Scale,
  Lock,
  Bot,
} from 'lucide-react';

export default function Home() {
  const [dealKey, setDealKey] = useState(0);

  const handleResetDeal = () => {
    setDealKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 flex flex-col">
      <Navbar onNewDeal={handleResetDeal} />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
            <span>Kenya Small Claims Court Protocol (Cap 23)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 max-w-3xl mx-auto leading-tight">
            Legally Binding Micro-Agreements with{' '}
            <span className="underline decoration-2 decoration-zinc-900 underline-offset-4">
              Instant Biometric KYC
            </span>
          </h1>

          {/* Clean Monochrome Feature Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-600 font-medium">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200">
              <ShieldCheck className="h-4 w-4 text-zinc-900" />
              <span>Didit Facial Biometrics</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200">
              <Scale className="h-4 w-4 text-zinc-900" />
              <span>Small Claims Act (Max KES 1M)</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200">
              <Lock className="h-4 w-4 text-zinc-900" />
              <span>SHA-256 Tamper Seal</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200">
              <Bot className="h-4 w-4 text-zinc-900" />
              <span>Gemini AI Copilot</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Wizard */}
      <main className="flex-1 bg-[#fafafa]">
        <DealWizard key={dealKey} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-sm text-zinc-950">AGANA</span>
            <span className="text-zinc-300">|</span>
            <span>Kenya Small Claims Court Protocol</span>
          </div>

          <p className="text-center sm:text-right text-[11px] text-zinc-500">
            Compliant with Kenya Law of Contract Act (Cap 23), Small Claims Court Act (2016), & Data Protection Act (2019).
          </p>
        </div>
      </footer>
    </div>
  );
}
