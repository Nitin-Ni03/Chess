import React, { useMemo } from 'react';
import {
  Trophy,
  Award,
  TrendingUp,
  Activity,
  Shield,
  Target,
  BarChart2,
  PieChart,
  Layers,
  Flame,
  Swords,
  Clock,
  Sparkles,
} from 'lucide-react';
import { MOVE_TIERS } from '../ai/reviewEngine';

export function StatsPanel({
  ratedMoves = [],
  whitePlayerName = 'White',
  blackPlayerName = 'Black',
  whiteElo = 1200,
  blackElo = 1200,
  careerStats = {},
  matchHistory = [],
  onOpenFullStats,
  currentEvalScore = 0,
}) {
  // Compute match-level stats dynamically
  const matchStats = useMemo(() => {
    if (!ratedMoves || ratedMoves.length === 0) {
      return {
        whiteAcc: 100,
        blackAcc: 100,
        whiteCpl: 0,
        blackCpl: 0,
        whiteCounts: {},
        blackCounts: {},
        evalPoints: [],
        whiteBestMoves: 0,
        whiteBlunders: 0,
        blackBestMoves: 0,
        blackBlunders: 0,
      };
    }

    const whiteAccs = [];
    const blackAccs = [];
    const whiteCpls = [];
    const blackCpls = [];
    const whiteCounts = {};
    const blackCounts = {};

    ratedMoves.forEach((m) => {
      if (m.isWhite) {
        whiteAccs.push(m.accuracy);
        whiteCpls.push(m.cpl);
        whiteCounts[m.tier.id] = (whiteCounts[m.tier.id] || 0) + 1;
      } else {
        blackAccs.push(m.accuracy);
        blackCpls.push(m.cpl);
        blackCounts[m.tier.id] = (blackCounts[m.tier.id] || 0) + 1;
      }
    });

    const avg = (arr) => (arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 100);
    const avgInt = (arr) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

    const evalPoints = ratedMoves.map((m, i) => ({
      ply: i + 1,
      eval: m.evalScore,
      clamped: Math.max(-8, Math.min(8, m.evalScore)),
    }));

    return {
      whiteAcc: avg(whiteAccs),
      blackAcc: avg(blackAccs),
      whiteCpl: avgInt(whiteCpls),
      blackCpl: avgInt(blackCpls),
      whiteCounts,
      blackCounts,
      evalPoints,
      whiteBestMoves: (whiteCounts.best || 0) + (whiteCounts.brilliant || 0) + (whiteCounts.great || 0),
      whiteBlunders: (whiteCounts.blunder || 0) + (whiteCounts.mistake || 0),
      blackBestMoves: (blackCounts.best || 0) + (blackCounts.brilliant || 0) + (blackCounts.great || 0),
      blackBlunders: (blackCounts.blunder || 0) + (blackCounts.mistake || 0),
    };
  }, [ratedMoves]);

  // Overall career calculations
  const totalCareer = careerStats.totalGames || 0;
  const wins = careerStats.wins || 0;
  const losses = careerStats.losses || 0;
  const draws = careerStats.draws || 0;
  const winRate = totalCareer > 0 ? ((wins / totalCareer) * 100).toFixed(1) : '0.0';

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-white/10 shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-neutral-900/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm tracking-wide text-amber-200">
              Live Game Stats
            </h3>
            <p className="text-[10px] text-neutral-400">Real-Time Match Analytics</p>
          </div>
        </div>

        {onOpenFullStats && (
          <button
            onClick={onOpenFullStats}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Full Profile →
          </button>
        )}
      </div>

      {/* Stats Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Real-time Accuracy Comparison Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* White Accuracy */}
          <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-emerald-500" style={{ width: `${matchStats.whiteAcc}%` }} />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-neutral-200 truncate flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white inline-block" />
                {whitePlayerName}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{whiteElo}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {matchStats.whiteAcc}%
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center justify-between">
              <span>Avg CPL: {matchStats.whiteCpl}</span>
              <span className="text-emerald-400/90 font-semibold">{matchStats.whiteBestMoves} ★</span>
            </div>
          </div>

          {/* Black Accuracy */}
          <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-cyan-500" style={{ width: `${matchStats.blackAcc}%` }} />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-neutral-200 truncate flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-600 inline-block" />
                {blackPlayerName}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">{blackElo}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {matchStats.blackAcc}%
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center justify-between">
              <span>Avg CPL: {matchStats.blackCpl}</span>
              <span className="text-cyan-400/90 font-semibold">{matchStats.blackBestMoves} ★</span>
            </div>
          </div>
        </div>

        {/* Live Evaluation Advantage Graph */}
        <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Advantage Momentum
            </span>
            <span className={`font-mono font-bold ${currentEvalScore > 0 ? 'text-emerald-400' : currentEvalScore < 0 ? 'text-cyan-400' : 'text-neutral-300'}`}>
              {currentEvalScore > 0 ? `+${currentEvalScore}` : currentEvalScore}
            </span>
          </div>

          <div className="relative h-14 w-full bg-neutral-950/80 rounded-lg overflow-hidden border border-white/5">
            {/* Center zero line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15 -translate-y-1/2" />
            
            {matchStats.evalPoints.length > 0 ? (
              <svg className="w-full h-full" viewBox={`0 -8 ${matchStats.evalPoints.length || 1} 16`} preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="0.9"
                  points={matchStats.evalPoints
                    .map((pt, i) => `${i},${-pt.clamped}`)
                    .join(' ')}
                />
              </svg>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] text-neutral-500 italic">
                Awaiting first moves...
              </div>
            )}
          </div>
        </div>

        {/* Move Breakdown Matrix */}
        <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
          <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Move Classifications</span>
            <span className="text-[10px] font-mono text-neutral-500">W / B</span>
          </h4>

          <div className="space-y-1 text-xs">
            {[MOVE_TIERS.BRILLIANT, MOVE_TIERS.BEST, MOVE_TIERS.GOOD, MOVE_TIERS.INACCURACY, MOVE_TIERS.BLUNDER].map((tier) => {
              const w = matchStats.whiteCounts[tier.id] || 0;
              const b = matchStats.blackCounts[tier.id] || 0;
              return (
                <div
                  key={tier.id}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-neutral-950/40 text-[11px]"
                >
                  <span className="font-mono font-bold w-6 text-center text-neutral-300">{w}</span>
                  <div className="flex items-center gap-1.5 flex-1 justify-center">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${tier.badgeClass}`}>
                      {tier.symbol}
                    </span>
                    <span className="font-medium text-neutral-300">{tier.label}</span>
                  </div>
                  <span className="font-mono font-bold w-6 text-center text-neutral-300">{b}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Career Summary Card */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-neutral-900/60 to-neutral-900/40 border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Career Record
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {careerStats.elo || 1200} ELO
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center pt-1 border-t border-white/5">
            <div className="p-1 rounded bg-black/30">
              <div className="text-[9px] uppercase text-neutral-400">Win Rate</div>
              <div className="text-xs font-bold font-mono text-emerald-400">{winRate}%</div>
            </div>
            <div className="p-1 rounded bg-black/30">
              <div className="text-[9px] uppercase text-neutral-400">Streak</div>
              <div className="text-xs font-bold font-mono text-amber-300">{careerStats.winStreak || 0} 🔥</div>
            </div>
            <div className="p-1 rounded bg-black/30">
              <div className="text-[9px] uppercase text-neutral-400">Games</div>
              <div className="text-xs font-bold font-mono text-neutral-200">{totalCareer}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
