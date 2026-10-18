import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Frown, Handshake, RotateCcw, Share2, X, Swords } from 'lucide-react';

export function GameOverModal({
  isOpen,
  winner, // 'w' | 'b' | 'draw'
  winReason,
  playerColor = 'w',
  eloDelta = 0,
  onRematch,
  onNewGame,
  onClose,
}) {
  if (!isOpen) return null;

  const isPlayerWinner = winner === playerColor;
  const isDraw = winner === 'draw';

  useEffect(() => {
    if (isPlayerWinner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff', '#10b981'],
        });
      } catch {
        // ignore if confetti blocked
      }
    }
  }, [isPlayerWinner]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-sm rounded-2xl border border-amber-500/30 shadow-2xl p-6 relative text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-xl">
          {isDraw ? (
            <div className="w-full h-full rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
              <Handshake className="w-8 h-8" />
            </div>
          ) : isPlayerWinner ? (
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 shadow-amber-500/30">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <Frown className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold font-serif text-neutral-100 mb-1">
          {isDraw
            ? 'Game Drawn'
            : isPlayerWinner
            ? 'Victory!'
            : 'Defeat'}
        </h2>

        {/* Subtitle / Reason */}
        <p className="text-xs text-neutral-400 mb-4">{winReason || 'Game concluded'}</p>

        {/* ELO Result Badge */}
        {eloDelta !== 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-xs font-mono mb-5">
            <span className="text-neutral-400">Rating:</span>
            <span className={`font-bold ${eloDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {eloDelta > 0 ? `+${eloDelta}` : eloDelta} ELO
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onRematch}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            Rematch
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl glass-button text-neutral-300 text-xs font-medium transition-colors"
          >
            Review Board Position
          </button>
        </div>
      </div>
    </div>
  );
}
