'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Shield, Check } from 'lucide-react';

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
          <h4 className="text-xs font-bold text-zinc-950 flex items-center space-x-1.5">
            <Shield className="h-3.5 w-3.5 text-zinc-900" />
            <span>Contract Clauses & Covenants</span>
          </h4>
          <p className="text-[11px] text-zinc-500">
            Presets + Creator Custom Clauses (Enforceable under Cap 23)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-950 transition-all"
        >
          <Plus className="h-3 w-3" />
          <span>Add Custom Clause</span>
        </button>
      </div>

      {/* Add Clause Expandable Box */}
      {showAddForm && (
        <div className="p-4 bg-zinc-50 border border-zinc-300 rounded-xl space-y-3 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-950">
              Define New Creator Clause
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-zinc-500 hover:text-black text-xs"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Clause Title (e.g. 48-Hour Inspection, Fuel Tank Handover, Early Termination)"
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-black"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Detailed terms and legal covenant..."
            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-black leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!title.trim() || !content.trim()}
              onClick={handleAddClause}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                title.trim() && content.trim()
                  ? 'bg-black hover:bg-zinc-800 text-white'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
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
            className="p-3 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-left space-y-1 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-zinc-900">
                  {idx + 1}. {clause.title}
                </span>
                {clause.isCustom ? (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-300">
                    Custom Clause
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                    Preset
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveClause(clause.id)}
                className="text-zinc-400 hover:text-red-600 p-1"
                title="Remove clause"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed pl-1">
              {clause.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
