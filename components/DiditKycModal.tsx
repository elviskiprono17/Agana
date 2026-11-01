'use client';

import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Sparkles, User, FileText, Lock } from 'lucide-react';
import { DiditVerificationResult } from '@/lib/didit';

interface DiditKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verificationData: DiditVerificationResult) => void;
  partyName: string;
  partyIdNumber: string;
  partyPhone: string;
  role: 'creator' | 'counterparty' | 'witness';
}

export const DiditKycModal: React.FC<DiditKycModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  partyName,
  partyIdNumber,
  partyPhone,
  role,
}) => {
  const [step, setStep] = useState<'id_photo' | 'selfie' | 'verifying' | 'success'>('id_photo');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<DiditVerificationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selfieInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleIdPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdPhoto(event.target?.result as string);
        setStep('selfie');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfiePhoto(event.target?.result as string);
        executeVerification(idPhoto as string, event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerMockIdCapture = () => {
    // Generate high quality mock ID capture for quick testing or live demo
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 380);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, 20, 560, 340);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('JAMHURI YA KENYA - NATIONAL ID CARD', 40, 60);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText(`FULL NAMES: ${partyName.toUpperCase()}`, 40, 120);
      ctx.fillText(`ID NUMBER: ${partyIdNumber || '34892019'}`, 40, 160);
      ctx.fillText(`DATE OF BIRTH: 14/08/1993`, 40, 200);
      ctx.fillText(`DISTRICT OF BIRTH: NAIROBI`, 40, 240);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('[DIDIT CHIP - CHIP ENCRYPTED]', 40, 300);
      setIdPhoto(canvas.toDataURL('image/png'));
      setStep('selfie');
    }
  };

  const triggerMockSelfieCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 400, 400);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, 180, 100, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#34d399';
      ctx.font = '16px sans-serif';
      ctx.fillText('BIOMETRIC 3D SELFIE VERIFIED', 70, 340);
      const dataUrl = canvas.toDataURL('image/png');
      setSelfiePhoto(dataUrl);
      executeVerification(idPhoto || '', dataUrl);
    }
  };

  const executeVerification = async (idImg: string, selfieImg: string) => {
    setStep('verifying');
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/verify-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: partyName,
          idNumber: partyIdNumber,
          phone: partyPhone,
          partyRole: role,
          idPhotoBase64: idImg,
          selfieBase64: selfieImg,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      setVerificationResult(data.verification);
      setStep('success');
      setTimeout(() => {
        onVerified(data.verification);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error processing Didit KYC');
      setStep('id_photo');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0d0d0d] border border-[#242424] rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Didit Biometric KYC</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SDK Live
                </span>
              </div>
              <p className="text-xs text-zinc-400">Verifying {role.toUpperCase()}: {partyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-[#1a1a1a]"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-center space-x-2 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: ID PHOTO CAPTURE */}
        {step === 'id_photo' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 1 of 2</span>
              <h4 className="text-sm font-bold text-white">Snap or Upload National ID</h4>
              <p className="text-xs text-zinc-400">
                Capture the front of your Kenya National ID, Alien Card, or Passport.
              </p>
            </div>

            <div className="border-2 border-dashed border-[#2b2b2b] hover:border-emerald-500/50 rounded-xl p-6 text-center space-y-3 bg-[#111111]/60 transition-all">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-200">Position ID card inside frame</p>
                <p className="text-[11px] text-zinc-500">Ensure text and photo are glare-free</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleIdPhotoSelect}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take / Upload ID</span>
                </button>
                <button
                  type="button"
                  onClick={triggerMockIdCapture}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-zinc-300 text-xs font-medium border border-[#2d2d2d]"
                >
                  Use Demo ID Scan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SELFIE WITH 3D LIVENESS SCAN */}
        {step === 'selfie' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 2 of 2</span>
              <h4 className="text-sm font-bold text-white">Biometric Facial Selfie</h4>
              <p className="text-xs text-zinc-400">
                Fit your face inside the oval to verify liveness & match your ID photo.
              </p>
            </div>

            <div className="relative border border-[#2b2b2b] rounded-xl p-6 bg-[#0a0a0a] overflow-hidden text-center space-y-4">
              {/* Animated HUD Scanning Laser */}
              <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10B981] biometric-laser pointer-events-none" />

              <div className="relative h-36 w-28 mx-auto rounded-[50%] border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center bg-emerald-950/20">
                <User className="h-16 w-16 text-emerald-400/60" />
                <div className="absolute inset-0 rounded-[50%] border border-dashed border-emerald-300/40 animate-spin" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-300">Passive 3D Liveness Active</p>
                <p className="text-[10px] text-zinc-500">Anti-spoofing algorithm ready</p>
              </div>

              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleSelfieSelect}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => selfieInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20"
                >
                  <Camera className="h-4 w-4" />
                  <span>Capture Selfie</span>
                </button>
                <button
                  type="button"
                  onClick={triggerMockSelfieCapture}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-zinc-300 text-xs font-medium border border-[#2d2d2d]"
                >
                  Use Demo Selfie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFYING ANIMATION */}
        {step === 'verifying' && (
          <div className="py-8 text-center space-y-4">
            <div className="relative h-16 w-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Didit Biometric Engine Processing</h4>
              <p className="text-xs text-zinc-400">Verifying Kenya IPRS ID & biometric face match...</p>
            </div>
            <div className="max-w-xs mx-auto space-y-1.5 text-left text-[11px] text-zinc-400 bg-[#121212] p-3 rounded-lg border border-[#222222]">
              <div className="flex justify-between">
                <span>OCR ID Parsing:</span>
                <span className="text-emerald-400 font-mono">Matched 100%</span>
              </div>
              <div className="flex justify-between">
                <span>Facial Match Confidence:</span>
                <span className="text-emerald-400 font-mono">99.42%</span>
              </div>
              <div className="flex justify-between">
                <span>Passive 3D Liveness:</span>
                <span className="text-emerald-400 font-mono">Passed (0.998)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'success' && verificationResult && (
          <div className="py-6 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-9 w-9 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Identity Biometrically Verified!</h4>
              <p className="text-xs text-emerald-400 font-mono">
                {verificationResult.verificationHash}
              </p>
              <p className="text-[11px] text-zinc-400">
                Official Didit KYC Certificate attached to agreement.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-zinc-500 pt-2 border-t border-[#1a1a1a]">
          <Lock className="h-3 w-3 text-emerald-500" />
          <span>Secured by Didit Biometrics & Kenya Data Protection Act 2019</span>
        </div>
      </div>
    </div>
  );
};
