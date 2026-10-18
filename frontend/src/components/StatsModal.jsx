import React from 'react';
import { Trophy, Award, TrendingUp, X, RotateCcw, Swords, Calendar } from 'lucide-react';

export function StatsModal({ isOpen, onClose, stats, matchHistory = [], onResetStats }) {
  if (!isOpen) return null;

  const total = stats.totalGames || 0;
  const wins = stats.wins || 0;
  const losses = stats.losses || 0;
  const draws = stats.draws || 0;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  // Title tier based on ELO
  const getEloTitle = (elo) => {
    if (elo >= 2400) return { title: 'Grandmaster', color: 'text-amber-400' };
    if (elo >= 2200) return { title: 'International Master', color: 'text-purple-400' };
    if (elo >= 2000) return { title: 'FIDE Master', color: 'text-blue-400' };
    if (elo >= 1800) return { title: 'Candidate Master', color: 'text-emerald-400' };
    if (elo >= 1500) return { title: 'Club Player', color: 'text-amber-300' };
    if (elo >= 1200) return { title: 'Intermediate', color: 'text-neutral-300' };
    return { title: 'Novice', color: 'text-neutral-400' };
  };

  const { title, color } = getEloTitle(stats.elo || 1200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">Career Statistics</h2>
            <p className="text-xs text-neutral-400">Simulated FIDE Performance & Match History</p>
          </div>
        </div>

        {/* ELO Profile Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-neutral-900/60 to-neutral-900/40 border border-amber-500/30 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Player Rating</div>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-0.5">{stats.elo || 1200}</div>
            <div className={`text-xs font-semibold ${color} mt-0.5 flex items-center gap-1`}>
              <Award className="w-3.5 h-3.5" />
              {title}
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-xs text-neutral-400">
              Win Streak: <strong className="text-emerald-400">{stats.winStreak || 0}</strong>
            </div>
            <div className="text-xs text-neutral-400">
              Best Streak: <strong className="text-amber-300">{stats.bestStreak || 0}</strong>
            </div>
          </div>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="glass-card p-3 rounded-xl text-center">
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider">Played</div>
            <div className="text-xl font-bold text-neutral-100 font-mono mt-1">{total}</div>
          </div>
          <div className="glass-card p-3 rounded-xl text-center">
            <div className="text-emerald-400 text-[11px] uppercase tracking-wider">Won</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{wins}</div>
          </div>
          <div className="glass-card p-3 rounded-xl text-center">
            <div className="text-red-400 text-[11px] uppercase tracking-wider">Lost</div>
            <div className="text-xl font-bold text-red-400 font-mono mt-1">{losses}</div>
          </div>
          <div className="glass-card p-3 rounded-xl text-center">
            <div className="text-amber-300 text-[11px] uppercase tracking-wider">Win Rate</div>
            <div className="text-xl font-bold text-amber-300 font-mono mt-1">{winRate}%</div>
          </div>
        </div>

        {/* Recent Matches Section */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" />
              Recent Matches
            </h4>
            <span className="text-[11px] text-neutral-500 font-mono">
              Last {matchHistory.length} matches
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {matchHistory.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500 italic">
                No recorded games yet. Finish a match to record your score!
              </div>
            ) : (
              matchHistory.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        m.result === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : m.result === 'loss'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-neutral-700/40 text-neutral-300 border border-neutral-600/40'
                      }`}
                    >
                      {m.result}
                    </span>
                    <div>
                      <span className="font-semibold text-neutral-200">vs {m.opponent}</span>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {m.date || 'Recent'} • {m.mode || 'Casual'}
                      </div>
                    </div>
                  </div>

                  <div className="font-mono text-xs">
                    {m.eloDelta > 0 ? (
                      <span className="text-emerald-400 font-bold">+{m.eloDelta}</span>
                    ) : m.eloDelta < 0 ? (
                      <span className="text-red-400 font-bold">{m.eloDelta}</span>
                    ) : (
                      <span className="text-neutral-400">0</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onResetStats}
            className="text-xs text-neutral-500 hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Statistics
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
