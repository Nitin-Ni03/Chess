import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { MOVE_TIERS } from '../ai/reviewEngine';

// Coach Avatars SVG with dynamic expressions
function CoachAvatar({ mood = 'happy', size = 'lg', persona = 'danny' }) {
  const isLarge = size === 'lg';
  const dim = isLarge ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-10 h-10';

  // Eye and mouth expressions based on mood
  let mouthPath = 'M14 26 Q20 30 26 26'; // friendly smile
  let eyes = (
    <>
      <circle cx="16" cy="18" r="2.2" fill="#1e293b" />
      <circle cx="24" cy="18" r="2.2" fill="#1e293b" />
    </>
  );
  let brow = null;
  let accessory = null;

  if (mood === 'celebrating') {
    mouthPath = 'M13 24 Q20 34 27 24 Z'; // open overjoyed smile
    eyes = (
      <>
        <path d="M13 18 Q16 14 19 18" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M21 18 Q24 14 27 18" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    );
    accessory = (
      <polygon points="20 4, 22 8, 27 9, 23 13, 24 18, 20 15, 16 18, 17 13, 13 9, 18 8" fill="#fbbf24" />
    );
  } else if (mood === 'proud') {
    mouthPath = 'M14 25 Q20 29 26 25';
    eyes = (
      <>
        <circle cx="16" cy="18" r="2.5" fill="#1e293b" />
        <circle cx="24" cy="18" r="2.5" fill="#1e293b" />
      </>
    );
  } else if (mood === 'thoughtful') {
    mouthPath = 'M15 26 L25 26'; // flat line
    eyes = (
      <>
        <circle cx="16" cy="17" r="2" fill="#1e293b" />
        <circle cx="24" cy="17" r="2" fill="#1e293b" />
      </>
    );
    brow = (
      <line x1="13" y1="14" x2="19" y2="15" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
    );
  } else if (mood === 'warning') {
    mouthPath = 'M15 27 Q20 24 25 27'; // inverted slight frown
    eyes = (
      <>
        <circle cx="15.5" cy="18" r="2.2" fill="#991b1b" />
        <circle cx="24.5" cy="18" r="2.2" fill="#991b1b" />
      </>
    );
    brow = (
      <>
        <line x1="13" y1="14" x2="18" y2="16" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="27" y1="14" x2="22" y2="16" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" />
      </>
    );
  } else if (mood === 'facepalm' || mood === 'shocked') {
    mouthPath = 'M16 28 Q20 25 24 28';
    eyes = (
      <>
        <circle cx="16" cy="17" r="3" fill="#dc2626" />
        <circle cx="24" cy="17" r="3" fill="#dc2626" />
      </>
    );
    accessory = (
      <ellipse cx="20" cy="27" rx="3.5" ry="4" fill="#dc2626" />
    );
  }

  // Aura glow color by mood
  const glowBorder =
    mood === 'celebrating'
      ? 'border-cyan-400 ring-4 ring-cyan-400/30 shadow-cyan-500/50'
      : mood === 'facepalm' || mood === 'warning'
      ? 'border-red-400 ring-4 ring-red-500/30 shadow-red-500/50'
      : mood === 'proud' || mood === 'happy'
      ? 'border-emerald-400 ring-4 ring-emerald-400/30 shadow-emerald-500/50'
      : 'border-amber-400 ring-4 ring-amber-400/20 shadow-amber-500/30';

  return (
    <div
      className={`relative rounded-2xl p-1 bg-gradient-to-tr from-neutral-800 to-neutral-700 border-2 shadow-xl ${glowBorder} flex items-center justify-center shrink-0 transition-all duration-300`}
    >
      <svg viewBox="0 0 40 40" className={`${dim} rounded-xl`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Coach Danny Cap / Hair */}
        <rect width="40" height="40" rx="10" fill="#1e2230" />
        {/* Face shape */}
        <circle cx="20" cy="21" r="12" fill="#fde68a" />
        {/* Cap or Coach Hat */}
        <path d="M7 16 C8 8, 32 8, 33 16 Z" fill="#0284c7" />
        <path d="M5 16 C10 14, 30 14, 35 16 C35 17, 30 18, 5 18 Z" fill="#0369a1" />
        {/* Coach Danny's glasses */}
        <circle cx="16" cy="18" r="4.2" stroke="#0f172a" strokeWidth="1.2" fill="none" />
        <circle cx="24" cy="18" r="4.2" stroke="#0f172a" strokeWidth="1.2" fill="none" />
        <line x1="20.2" y1="18" x2="19.8" y2="18" stroke="#0f172a" strokeWidth="1.5" />
        {/* Brows */}
        {brow}
        {/* Eyes */}
        {eyes}
        {/* Mouth */}
        <path d={mouthPath} stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" fill={mood === 'celebrating' ? '#dc2626' : 'none'} />
        {/* Blush / Cheek */}
        <circle cx="12" cy="22" r="1.8" fill="#f87171" opacity="0.4" />
        <circle cx="28" cy="22" r="1.8" fill="#f87171" opacity="0.4" />
        {/* Accessory / Trophy / Star */}
        {accessory}
      </svg>
    </div>
  );
}

export function CoachPanel({
  lastRatedMove = null,
  onAskCoachHint,
  hintData = null,
  turn = 'w',
  isAiThinking = false,
  onShowBestMoveArrow,
  isBestMoveArrowVisible = false,
  ratedHistory = [],
  onJumpToMove,
  currentStep = -1,
}) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [coachPersona, setCoachPersona] = useState('danny'); // 'danny' | 'sophia' | 'bot'
  const [coachAdviceStep, setCoachAdviceStep] = useState(0); // 0: none, 1: idea, 2: piece, 3: full move

  const currentMoveAnalysis = lastRatedMove;
  const mood = currentMoveAnalysis?.coach?.coachMood || (turn === 'w' ? 'happy' : 'thoughtful');

  // Voice narration of coach feedback
  useEffect(() => {
    if (voiceEnabled && currentMoveAnalysis?.coach?.comment && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${currentMoveAnalysis.tier?.label || ''}. ${currentMoveAnalysis.coach.comment}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05;
      utterance.pitch = coachPersona === 'sophia' ? 1.2 : 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentMoveAnalysis, voiceEnabled, coachPersona]);

  // Request strategic guidance
  const handleRequestAdvice = () => {
    if (coachAdviceStep === 0) {
      onAskCoachHint?.();
      setCoachAdviceStep(1);
    } else if (coachAdviceStep === 1) {
      setCoachAdviceStep(2);
    } else if (coachAdviceStep === 2) {
      setCoachAdviceStep(3);
      onShowBestMoveArrow?.(true);
    } else {
      setCoachAdviceStep(0);
      onShowBestMoveArrow?.(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-white/10 shadow-xl">
      {/* Header with Coach Avatar & Voice toggle */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-neutral-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm tracking-wide text-cyan-200 flex items-center gap-1.5">
              Coach Danny
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </h3>
            <p className="text-[10px] text-neutral-400">Real-time Chess.com Move Mentor</p>
          </div>
        </div>

        {/* Voice Toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          title={voiceEnabled ? 'Mute Coach Voice' : 'Enable Coach Voice'}
          className={`p-1.5 rounded-lg border transition-all ${
            voiceEnabled
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
              : 'border-white/10 text-neutral-400 hover:text-white bg-neutral-800/50'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Coach Interaction Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Animated Coach Dialog Card */}
        <div className="flex items-start gap-3.5">
          <CoachAvatar mood={mood} size="lg" persona={coachPersona} />

          {/* Speech Bubble */}
          <div className="flex-1 relative bg-neutral-900/90 border border-cyan-500/20 rounded-2xl p-3.5 shadow-xl text-neutral-200">
            {/* Bubble pointer triangle */}
            <div className="absolute top-5 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-neutral-900" />

            {currentMoveAnalysis ? (
              <div className="space-y-1.5">
                {/* Rating Badge Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        currentMoveAnalysis.tier?.badgeClass || 'bg-emerald-500 text-neutral-950'
                      }`}
                    >
                      <span>{currentMoveAnalysis.tier?.symbol}</span>
                      <span>{currentMoveAnalysis.tier?.label}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-200">
                      {currentMoveAnalysis.san}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-400">
                    {currentMoveAnalysis.accuracy}% acc
                  </span>
                </div>

                {/* Coach Commentary Title & Explanation */}
                <h4 className="text-xs font-bold text-neutral-100 pt-0.5">
                  {currentMoveAnalysis.coach?.title || 'Move Assessment'}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {currentMoveAnalysis.coach?.comment || 'Solid development and central presence.'}
                </p>

                {/* Pedagogical Tip */}
                {currentMoveAnalysis.coach?.tip && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-start gap-1.5 text-[11px] text-cyan-300/90 bg-cyan-950/30 p-2 rounded-lg">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                    <span>{currentMoveAnalysis.coach.tip}</span>
                  </div>
                )}

                {/* Show Engine Best Move Button if move wasn't best */}
                {currentMoveAnalysis.bestMove && currentMoveAnalysis.tier?.id !== 'best' && currentMoveAnalysis.tier?.id !== 'brilliant' && (
                  <button
                    onClick={() => onShowBestMoveArrow?.(!isBestMoveArrowVisible)}
                    className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{isBestMoveArrowVisible ? 'Hide Best Move Arrow' : `Show Engine Choice: ${currentMoveAnalysis.bestMove.san}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-200">Welcome to Match Analysis!</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Make your move on the board! I’ll evaluate every play, give you instant Chess.com ratings, and guide you through key master ideas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive "Ask Coach for Advice" Section */}
        <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Strategic Coach Hint
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {coachAdviceStep === 0 ? 'Ready' : `Hint Level ${coachAdviceStep}/3`}
            </span>
          </div>

          {/* Dynamic Advice Body */}
          {coachAdviceStep > 0 && hintData ? (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                {coachAdviceStep === 1 && (
                  <div>
                    <strong className="text-amber-400">General Plan:</strong> {hintData.reason || 'Look for active piece development and king safety.'}
                  </div>
                )}
                {coachAdviceStep === 2 && (
                  <div>
                    <strong className="text-amber-400">Target Piece:</strong> Focus on moving the piece currently on square{' '}
                    <span className="font-mono px-1 py-0.5 rounded bg-amber-900/60 font-bold text-amber-300">
                      {hintData.from.toUpperCase()}
                    </span>
                    .
                  </div>
                )}
                {coachAdviceStep === 3 && (
                  <div>
                    <strong className="text-amber-400">Optimal Move:</strong> Play{' '}
                    <span className="font-mono px-1.5 py-0.5 rounded bg-emerald-900/60 font-bold text-emerald-300">
                      {hintData.san}
                    </span>{' '}
                    ({hintData.from} → {hintData.to}).
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-neutral-400">
              Stuck or need positional inspiration? Ask Coach for progressive hints that won't ruin the challenge.
            </p>
          )}

          <button
            onClick={handleRequestAdvice}
            className="w-full py-2 rounded-lg bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all active:scale-98"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {coachAdviceStep === 0
              ? 'Ask Coach What to Do'
              : coachAdviceStep === 1
              ? 'Reveal Piece to Move'
              : coachAdviceStep === 2
              ? 'Reveal Exact Best Move'
              : 'Clear Hint'}
          </button>
        </div>

        {/* Recent Rated Moves Mini-Feed */}
        {ratedHistory.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
              Recent Rated Plays
            </h4>

            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {ratedHistory.slice(-5).reverse().map((item, idx) => {
                const isActive = item.moveIndex === currentStep;
                return (
                  <div
                    key={idx}
                    onClick={() => onJumpToMove?.(item.moveIndex)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                        : 'bg-neutral-900/50 border-white/5 text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          item.tier?.badgeClass || 'bg-emerald-500 text-neutral-950'
                        }`}
                      >
                        {item.tier?.symbol}
                      </span>
                      <span className="font-mono font-bold">
                        {item.moveNumber}.{item.isWhite ? '' : '..'}{item.san}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {item.accuracy}%
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
