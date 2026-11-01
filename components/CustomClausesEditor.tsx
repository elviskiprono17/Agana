'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Shield, Sparkles, Check } from 'lucide-react';

export interface Clause {
  id: string;
  title: string;
  content: string;
  isCustom?: boolean;
}

interface CustomClausesEditorProps {
  clauses: Clause[];
  onChange: (updatedClauses: Clause[]) => void;
}

export const CustomClausesEditor: React.FC<CustomClausesEditorProps> = ({
  clauses,
  onChange,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddClause = () => {
    if (!title.trim() || !content.trim()) return;
    const newClause: Clause = {
      id: 'custom_' + Date.now(),
      title: title.trim(),
      content: content.trim(),
      isCustom: true,
    };
    onChange([...clauses, newClause]);
    setTitle('');
    setContent('');
    setShowAddForm(false);
  };

  const handleRemoveClause = (id: string) => {
    onChange(clauses.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Contract Clauses & Covenants</span>
          </h4>
          <p className="text-[11px] text-zinc-400">
            Presets + Creator Custom Clauses (Enforceable under Cap 23)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#181818] hover:bg-[#222222] border border-[#2d2d2d] text-emerald-400 hover:text-emerald-300 transition-all"
        >
          <Plus className="h-3 w-3" />
          <span>Add Custom Clause</span>
        </button>
      </div>

      {/* Add Clause Expandable Box */}
      {showAddForm && (
        <div className="p-3.5 bg-[#121212] border border-emerald-500/40 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Define New Creator Clause</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-zinc-500 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Clause Title (e.g. 48-Hour Inspection, Fuel Tank Handover, Early Termination)"
            className="w-full bg-[#0a0a0a] border border-[#2b2b2b] rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Detailed terms and legal covenant..."
            className="w-full bg-[#0a0a0a] border border-[#2b2b2b] rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!title.trim() || !content.trim()}
              onClick={handleAddClause}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                title.trim() && content.trim()
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Save Clause</span>
            </button>
          </div>
        </div>
      )}

      {/* Clause Cards */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {clauses.map((clause, idx) => (
          <div
            key={clause.id || idx}
            className="p-3 bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#2a2a2a] rounded-xl text-left space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-zinc-200">
                  {idx + 1}. {clause.title}
                </span>
                {clause.isCustom ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Custom Clause
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    Preset
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveClause(clause.id)}
                className="text-zinc-500 hover:text-red-400 p-1"
                title="Remove clause"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed pl-1">
              {clause.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
