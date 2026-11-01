'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, Type } from 'lucide-react';

interface SignaturePadProps {
  signerName: string;
  role: string;
  onSave: (dataUrl: string) => void;
  savedSignature?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signerName,
  role,
  onSave,
  savedSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(signerName);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000'; // Black ink
    ctx.lineWidth = 2.5;
  }, [mode]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const handleConfirmType = () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 120;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.font = 'italic 32px "Dancing Script", cursive, Georgia, serif';
      ctx.fillText(typedName || signerName, 20, 70);
      onSave(tempCanvas.toDataURL('image/png'));
    }
  };

  if (savedSignature) {
    return (
      <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-300 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-200 flex items-center justify-center">
            <Check className="h-4 w-4 text-zinc-950" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-950">Signed by {signerName}</p>
            <p className="text-[10px] text-zinc-600">Digitally executed & verified</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSave('')}
          className="text-xs text-zinc-600 hover:text-black px-2.5 py-1 rounded bg-white hover:bg-zinc-100 border border-zinc-200"
        >
          Resign
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-zinc-950">{role}: {signerName}</span>
          <p className="text-[10px] text-zinc-500">Draw with finger/mouse or type legal name</p>
        </div>
        <div className="flex items-center space-x-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
              mode === 'draw' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'
            }`}
          >
            <PenTool className="h-3 w-3" />
            <span>Draw</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 transition-all ${
              mode === 'type' ? 'bg-black text-white' : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Type className="h-3 w-3" />
            <span>Type</span>
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-2">
          <div className="relative w-full h-28 bg-[#fafafa] rounded-lg border border-zinc-300 overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-zinc-400 text-xs italic">
                Sign here with finger or mouse
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center space-x-1 text-xs text-zinc-600 hover:text-black px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              disabled={!hasDrawn}
              onClick={handleConfirmDraw}
              className={`flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                hasDrawn
                  ? 'bg-black hover:bg-zinc-800 text-white shadow-sm'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Signature</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Type legal name"
            className="w-full bg-[#fafafa] border border-zinc-300 rounded-lg px-3 py-2 text-sm text-black font-serif italic focus:outline-none focus:border-black"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleConfirmType}
              className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-white shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Typed Signature</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
