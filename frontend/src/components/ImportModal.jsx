import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

export function ImportModal({ isOpen, onClose, onLoadFEN, onLoadPGN }) {
  const [activeTab, setActiveTab] = useState('pgn'); // 'pgn' | 'fen'
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    setError('');
    if (!content.trim()) {
      setError('Please provide valid PGN or FEN text');
      return;
    }

    if (activeTab === 'fen') {
      const ok = onLoadFEN(content.trim());
      if (ok) {
        onClose();
        setContent('');
      } else {
        setError('Invalid FEN position string. Please check the notation.');
      }
    } else {
      const ok = onLoadPGN(content.trim());
      if (ok) {
        onClose();
        setContent('');
      } else {
        setError('Invalid PGN notation. Could not parse chess moves.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">Import Game / Position</h2>
            <p className="text-xs text-neutral-400">Load custom PGN match history or FEN board state</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 mb-4">
          <button
            onClick={() => { setActiveTab('pgn'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'pgn'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Import PGN
          </button>
          <button
            onClick={() => { setActiveTab('fen'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'fen'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Import FEN
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-950/50 border border-red-700/50 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeTab === 'pgn'
                ? 'Paste PGN text here (e.g., 1. e4 e5 2. Nf3 Nc6 3. Bb5 ...)'
                : 'Paste FEN string here (e.g., rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1)'
            }
            className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl p-3 text-xs font-mono text-neutral-200 outline-none transition-colors resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 glass-button py-2.5 rounded-xl text-xs font-semibold text-neutral-300"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Load Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
