import React from 'react';
import { ChessPiece } from './ChessPieces';

export function PromotionModal({ color = 'w', onSelect, onCancel }) {
  const pieces = ['q', 'r', 'b', 'n'];
  const labels = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 shadow-2xl max-w-sm w-full mx-4 text-center">
        <h3 className="text-xl font-bold font-serif text-amber-300 mb-1">Promote Pawn</h3>
        <p className="text-sm text-neutral-400 mb-5">Select a piece to promote your pawn to</p>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {pieces.map((type) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-800/80 hover:bg-amber-600/30 border border-neutral-700/60 hover:border-amber-400/60 transition-all transform hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 drop-shadow group-hover:scale-110 transition-transform">
                <ChessPiece piece={{ type, color }} />
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-amber-200">
                {labels[type]}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors uppercase tracking-wider"
        >
          Cancel Move
        </button>
      </div>
    </div>
  );
}
