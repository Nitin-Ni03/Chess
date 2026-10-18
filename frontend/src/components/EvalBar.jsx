import React from 'react';

// Live Evaluation Bar displaying White/Black material & positional advantage
export function EvalBar({ score = 0, isFlipped = false }) {
  // Score is in pawns (e.g., +1.5 means White is +1.5 pawns ahead)
  // Clamp between -10 and +10 for visual bar percentage
  const clampedScore = Math.max(-10, Math.min(10, score));

  // Convert to percentage (0% = Black totally winning, 50% = equal, 100% = White totally winning)
  // Non-linear logistic-like curve
  const whitePercent = 50 + (clampedScore / 10) * 45;
  const displayScore = score > 0 ? `+${score.toFixed(1)}` : score === 0 ? '0.0' : score.toFixed(1);

  return (
    <div className="hidden md:flex flex-col items-center justify-between h-[540px] md:h-[600px] lg:h-[640px] w-7 rounded-xl overflow-hidden glass-panel border border-white/10 shadow-lg relative p-0.5">
      {/* Black's portion (top if normal, bottom if flipped) */}
      <div
        className="w-full bg-neutral-900 transition-all duration-500 ease-out flex items-start justify-center pt-1"
        style={{ height: `${100 - whitePercent}%` }}
      >
        {score < -0.4 && (
          <span className="text-[10px] font-mono font-bold text-neutral-300">
            {displayScore}
          </span>
        )}
      </div>

      {/* White's portion */}
      <div
        className="w-full bg-neutral-100 transition-all duration-500 ease-out flex items-end justify-center pb-1"
        style={{ height: `${whitePercent}%` }}
      >
        {score >= -0.4 && (
          <span className="text-[10px] font-mono font-bold text-neutral-900">
            {displayScore}
          </span>
        )}
      </div>
    </div>
  );
}
