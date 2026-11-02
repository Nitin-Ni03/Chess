import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import {
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  Award,
  Zap,
  TrendingUp,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { MOVE_TIERS, analyzeFullGame } from '../ai/reviewEngine';

export function GameReviewModal({
  isOpen,
  onClose,
  history = [],
  whitePlayerName = 'White',
  blackPlayerName = 'Black',
  whiteElo = 1200,
  blackElo = 1200,
  theme = 'wood',
  is3d = false,
}) {
  if (!isOpen) return null;

  // Review Engine Analysis State
  const [reviewData, setReviewData] = useState(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [currentPly, setCurrentPly] = useState(0); // 0 = start position, 1 = after move 1, etc.
  const [showBestMove, setShowBestMove] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'key'
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2000); // 1000, 2000, 3000 ms

  // Retry Puzzle mode for Blunders / Mistakes
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryResult, setRetryResult] = useState(null); // 'correct' | 'wrong' | null

  // Run full game analysis when modal opens or history changes
  useEffect(() => {
    if (history.length === 0) {
      setReviewData(null);
      setAnalyzing(false);
      return;
    }

    setAnalyzing(true);
    // Asynchronous batch run so UI stays ultra-responsive
    const timer = setTimeout(() => {
      const data = analyzeFullGame(history);
      setReviewData(data);
      setAnalyzing(false);
      setCurrentPly(data.moves.length); // Start at the final position
    }, 120);

    return () => clearTimeout(timer);
  }, [history]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying || !reviewData || reviewData.moves.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPly((prev) => {
        if (filterMode === 'key') {
          // Find next key moment (mistake, blunder, brilliant, missed win)
          const nextKeyIdx = reviewData.moves.findIndex(
            (m, idx) =>
              idx > prev - 1 &&
              ['brilliant', 'great', 'mistake', 'blunder', 'missed_win'].includes(m.tier.id)
          );
          if (nextKeyIdx !== -1) return nextKeyIdx + 1;
          setIsPlaying(false);
          return prev;
        }

        if (prev >= reviewData.moves.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, reviewData, playSpeed, filterMode]);

  // Key moment plies
  const keyMomentPlies = useMemo(() => {
    if (!reviewData) return [];
    return reviewData.moves
      .map((m, idx) => ({
        ply: idx + 1,
        tier: m.tier.id,
      }))
      .filter((item) =>
        ['brilliant', 'great', 'inaccuracy', 'mistake', 'blunder', 'missed_win'].includes(item.tier)
      );
  }, [reviewData]);

  // Current board state reconstructed at currentPly
  const currentChess = useMemo(() => {
    const c = new Chess();
    if (!reviewData || currentPly <= 0) return c;

    const targetFen = reviewData.moves[currentPly - 1]?.fenAfter;
    if (targetFen) {
      try {
        c.load(targetFen);
      } catch {
        // fallback
      }
    }
    return c;
  }, [reviewData, currentPly]);

  const activeMove = reviewData && currentPly > 0 ? reviewData.moves[currentPly - 1] : null;

  // Board Badges & Arrows
  const boardBadges = useMemo(() => {
    if (!activeMove) return null;
    return {
      [activeMove.to]: {
        symbol: activeMove.tier.symbol,
        label: activeMove.tier.label,
        badgeClass: activeMove.tier.badgeClass,
      },
    };
  }, [activeMove]);

  const boardArrows = useMemo(() => {
    if (!activeMove) return [];
    const list = [];

    // Played Move Arrow
    list.push({
      from: activeMove.from,
      to: activeMove.to,
      color: activeMove.tier.color,
      opacity: 0.85,
    });

    // Best Move Arrow (Engine choice)
    if (
      showBestMove &&
      activeMove.bestMove &&
      (activeMove.bestMove.from !== activeMove.from || activeMove.bestMove.to !== activeMove.to)
    ) {
      list.push({
        from: activeMove.bestMove.from,
        to: activeMove.bestMove.to,
        color: '#10b981', // Emerald green
        opacity: 0.95,
      });
    }

    return list;
  }, [activeMove, showBestMove]);

  // Jump handlers
  const handleJumpToStart = () => setCurrentPly(0);
  const handleJumpToEnd = () => setCurrentPly(reviewData?.moves.length || 0);
  const handleStepBack = () => setCurrentPly((p) => Math.max(0, p - 1));
  const handleStepForward = () => setCurrentPly((p) => Math.min(reviewData?.moves.length || 0, p + 1));

  // Jump to next or previous key moment
  const handleNextKeyMoment = () => {
    if (!reviewData) return;
    const next = keyMomentPlies.find((k) => k.ply > currentPly);
    if (next) setCurrentPly(next.ply);
  };

  const handlePrevKeyMoment = () => {
    if (!reviewData) return;
    const prev = [...keyMomentPlies].reverse().find((k) => k.ply < currentPly);
    if (prev) setCurrentPly(prev.ply);
  };

  // Retry logic: allow player to test a move on the board
  const handleRetryMove = (from, to) => {
    if (!activeMove || !activeMove.bestMove) return;
    const isBest = from === activeMove.bestMove.from && to === activeMove.bestMove.to;
    setRetryResult(isBest ? 'correct' : 'wrong');
  };

  // Accuracy Ring SVG component
  const AccuracyRing = ({ accuracy, label, elo, color, isWhite }) => {
    const strokeDashoffset = 100 - accuracy;
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-neutral-800"
              strokeWidth="3.2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={color}
              strokeDasharray="100"
              strokeDashoffset={strokeDashoffset}
              strokeWidth="3.2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold font-mono text-neutral-100">{accuracy}%</span>
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">ACCURACY</span>
          </div>
        </div>

        <div className="mt-2 text-center">
          <div className="text-xs font-bold text-neutral-200 flex items-center justify-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${isWhite ? 'bg-neutral-100' : 'bg-neutral-800 border border-neutral-600'}`}
            />
            {label}
          </div>
          <div className="text-[11px] font-mono font-semibold text-amber-400 mt-0.5">
            Est. {elo} ELO
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-6xl max-h-[96vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-emerald-500/20">
              <Zap className="w-5 h-5 fill-neutral-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-neutral-100 flex items-center gap-2">
                Game Review
                <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Full Analysis
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Move-by-move evaluation, tactical breakdown, and grandmaster guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {analyzing ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-100">Analyzing Your Game...</h3>
              <p className="text-xs text-neutral-400">
                Calculating engine evaluations, brilliancies, and coach explanations
              </p>
            </div>
          </div>
        ) : !reviewData ? (
          <div className="p-12 text-center text-neutral-400">
            No moves recorded to review yet. Play some moves first!
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 sm:p-5">
            {/* Left Column (lg: 7 cols): Interactive Board & Review Walkthrough Controls */}
            <div className="lg:col-span-7 flex flex-col items-center gap-3">
              {/* Board */}
              <div className="w-full max-w-[480px] sm:max-w-[520px]">
                <ChessBoard
                  chess={currentChess}
                  turn={currentChess.turn()}
                  is3d={is3d}
                  theme={theme}
                  flipped={false}
                  lastMove={activeMove ? { from: activeMove.from, to: activeMove.to } : null}
                  badges={boardBadges}
                  arrows={boardArrows}
                  onMove={isRetrying ? handleRetryMove : () => {}}
                  disabled={!isRetrying}
                />
              </div>

              {/* Stepper Navigation Toolbar */}
              <div className="w-full max-w-[520px] p-2.5 rounded-xl bg-neutral-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-2 shadow-lg">
                {/* Jump controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleJumpToStart}
                    disabled={currentPly === 0}
                    title="Start of Game"
                    className="p-2 rounded-lg glass-button disabled:opacity-30 text-neutral-300 hover:text-white"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStepBack}
                    disabled={currentPly === 0}
                    title="Previous Move"
                    className="p-2 rounded-lg glass-button disabled:opacity-30 text-neutral-300 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? 'Pause Autoplay' : 'Autoplay Review'}
                    className={`p-2 rounded-lg border transition-colors ${
                      isPlaying
                        ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold'
                        : 'glass-button text-neutral-300 hover:text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={currentPly >= reviewData.moves.length}
                    title="Next Move"
                    className="p-2 rounded-lg glass-button disabled:opacity-30 text-neutral-300 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleJumpToEnd}
                    disabled={currentPly >= reviewData.moves.length}
                    title="End of Game"
                    className="p-2 rounded-lg glass-button disabled:opacity-30 text-neutral-300 hover:text-white"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Move Counter */}
                <div className="text-xs font-mono font-bold text-neutral-300 px-2 py-1 rounded bg-neutral-800">
                  {currentPly === 0 ? 'Start' : `Move ${Math.ceil(currentPly / 2)} (${currentPly}/${reviewData.moves.length})`}
                </div>

                {/* Show Best Move toggle */}
                <button
                  onClick={() => setShowBestMove(!showBestMove)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showBestMove
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {showBestMove ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>Best Move</span>
                </button>
              </div>

              {/* Advantage Curve SVG Graph (Clickable) */}
              <div className="w-full max-w-[520px] p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Advantage Progression
                  </span>
                  <span className="font-mono">
                    Eval: {activeMove ? (activeMove.evalScore > 0 ? `+${activeMove.evalScore}` : activeMove.evalScore) : '0.0'}
                  </span>
                </div>

                <div className="relative h-12 w-full bg-neutral-950/70 rounded-lg overflow-hidden border border-white/5">
                  {/* Center zero line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />

                  {/* SVG Sparkline */}
                  <svg className="w-full h-full cursor-pointer" viewBox={`0 -10 ${reviewData.moves.length || 1} 20`} preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="0.8"
                      points={reviewData.advantageGraph
                        .map((pt, i) => `${i},${-pt.clampedEval}`)
                        .join(' ')}
                    />
                    {/* Active move vertical cursor line */}
                    {currentPly > 0 && (
                      <line
                        x1={currentPly - 1}
                        y1={-10}
                        x2={currentPly - 1}
                        y2={10}
                        stroke="#fbbf24"
                        strokeWidth="1.2"
                      />
                    )}
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column (lg: 5 cols): Coach Danny Explanation, Stats & Classifications */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Accuracy Matchup Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-white/10 shadow-lg flex items-center justify-around">
                <AccuracyRing
                  accuracy={reviewData.whiteStats.accuracy}
                  label={whitePlayerName}
                  elo={reviewData.whiteStats.elo}
                  color="text-emerald-400"
                  isWhite={true}
                />
                <div className="h-16 w-px bg-white/10" />
                <AccuracyRing
                  accuracy={reviewData.blackStats.accuracy}
                  label={blackPlayerName}
                  elo={reviewData.blackStats.elo}
                  color="text-cyan-400"
                  isWhite={false}
                />
              </div>

              {/* Coach Danny Move Commentary Box */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-neutral-900/95 to-neutral-900/70 border border-white/10 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                      Coach Guidance
                    </h3>
                  </div>

                  {activeMove && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                          activeMove.tier.badgeClass
                        }`}
                      >
                        {activeMove.tier.symbol} {activeMove.tier.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-200">
                        {activeMove.san}
                      </span>
                    </div>
                  )}
                </div>

                {activeMove ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-neutral-100">
                      {activeMove.coach.title}
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {activeMove.coach.comment}
                    </p>

                    {/* Pedagogical Tip */}
                    {activeMove.coach.tip && (
                      <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                        <span>{activeMove.coach.tip}</span>
                      </div>
                    )}

                    {/* Retry Blunder / Practice Tactic button */}
                    {['mistake', 'blunder', 'missed_win', 'inaccuracy'].includes(activeMove.tier.id) && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <button
                          onClick={() => {
                            setIsRetrying(!isRetrying);
                            setRetryResult(null);
                          }}
                          className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            isRetrying
                              ? 'bg-amber-500 text-neutral-950'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10'
                          }`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {isRetrying ? 'Cancel Retry Mode' : 'Retry Move (Find the Best Play!)'}
                        </button>

                        {isRetrying && (
                          <div className="p-2 rounded-lg bg-neutral-950 border border-amber-500/30 text-xs text-center">
                            {retryResult === 'correct' ? (
                              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Brilliant! You found the best engine move!
                              </span>
                            ) : retryResult === 'wrong' ? (
                              <span className="text-red-400 font-bold flex items-center justify-center gap-1">
                                <AlertTriangle className="w-4 h-4" />
                                Not quite! Try looking for a more forcing line.
                              </span>
                            ) : (
                              <span className="text-neutral-400">
                                Drag or click a piece on the board to play your alternative.
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">
                    Use the navigation buttons below the board to step through each move and view coaching analysis.
                  </p>
                )}
              </div>

              {/* Move Classification Breakdown Table */}
              <div className="p-4 rounded-xl bg-neutral-900/90 border border-white/10 shadow-lg space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                  <span>Move Quality Breakdown</span>
                  <span className="text-[10px] font-mono text-neutral-500">White vs Black</span>
                </h4>

                <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto pr-1">
                  {Object.values(MOVE_TIERS).map((tier) => {
                    const whiteCount = reviewData.whiteStats.counts[tier.id] || 0;
                    const blackCount = reviewData.blackStats.counts[tier.id] || 0;

                    return (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between py-1 px-2 rounded-lg bg-neutral-950/40 hover:bg-white/5 transition-colors"
                      >
                        <span className="w-6 font-mono font-bold text-center text-neutral-300">
                          {whiteCount}
                        </span>

                        <div className="flex items-center gap-1.5 flex-1 justify-center">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${tier.badgeClass}`}
                          >
                            {tier.symbol}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-300">
                            {tier.label}
                          </span>
                        </div>

                        <span className="w-6 font-mono font-bold text-center text-neutral-300">
                          {blackCount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
