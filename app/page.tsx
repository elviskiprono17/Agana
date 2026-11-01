'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DealWizard } from '@/components/DealWizard';
import {
  ShieldCheck,
  Scale,
  Sparkles,
  Smartphone,
  Lock,
  FileText,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function Home() {
  const [dealKey, setDealKey] = useState(0);

  const handleResetDeal = () => {
    setDealKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <Navbar onNewDeal={handleResetDeal} />

      {/* Hero Banner for Y Combinator Reviewers */}
      <section className="relative overflow-hidden border-b border-[#1a1a1a] bg-gradient-to-b from-[#0f1411]/50 to-[#080808] py-8 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Y Combinator Application MVP | Nairobi, Kenya</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Legally Binding Micro-Agreements with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              Instant Biometric KYC
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Eliminating informal transaction fraud across Kenya’s <strong>KES 1.5 Trillion</strong> informal economy. Standardized for cows, smartphones, boda bodas & gigs under the <strong>Small Claims Act 2016 (Max KES 1M)</strong> with Didit Biometrics & SHA-256 integrity.
          </p>

          {/* Quick Pillars */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Didit Facial Biometrics</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Scale className="h-4 w-4 text-amber-400" />
              <span>Cap 23 Law of Contract</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>SHA-256 Tamper Seal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Gemini AI Legal Copilot</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Wizard */}
      <main className="flex-1">
        <DealWizard key={dealKey} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#181818] bg-[#060606] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-white">AGANA</span>
            <span className="text-zinc-600">|</span>
            <span>Kenya Small Claims Court Protocol</span>
          </div>

          <p className="text-center sm:text-right text-[11px] text-zinc-600">
            Compliant with Kenya Law of Contract Act (Cap 23), Small Claims Court Act (2016), & Data Protection Act (2019).
          </p>
        </div>
      </footer>
    </div>
  );
}
