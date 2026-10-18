import React, { useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  Copy,
  Lightbulb,
  RotateCcw,
  Flag,
  Handshake,
  Check,
} from 'lucide-react';
import { downloadPGN } from '../utils/chessHelpers';

export function MoveHistoryPanel({
  history = [],
  currentStep = -1,
  onJumpToMove,
  onUndo,
  onRedo,
  onGetHint,
  hintData,
  onResetGame,
  onResign,
  onOfferDraw,
  onFlipBoard,
  onOpenImportModal,
  getPGN,
  fen,
  gameOver = false,
  turn = 'w',
}) {
  const scrollRef = useRef(null);
  const [copiedPgn, setCopiedPgn] = React.useState(false);
  const [copiedFen, setCopiedFen] = React.useState(false);

  // Group moves into pairs: [ { num: 1, white: {...}, black: {...} } ]
  const movePairs = React.useMemo(() => {
    const pairs = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        num: Math.floor(i / 2) + 1,
        white: history[i],
        whiteIdx: i,
        black: history[i + 1] || null,
        blackIdx: i + 1,
      });
    }
    return pairs;
  }, [history]);

  // Auto-scroll to active move
  useEffect(() => {
    if (scrollRef.current) {
      const activeElem = scrollRef.current.querySelector('.active-move-step');
      if (activeElem) {
        activeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStep]);

  const handleCopyPgn = () => {
    const pgn = getPGN();
    navigator.clipboard.writeText(pgn);
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 1800);
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 1800);
  };

  const handleDownloadPgn = () => {
    const pgn = getPGN();
    downloadPGN(pgn, `game_${Date.now()}.pgn`);
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-white/10 shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-neutral-900/40">
        <h3 className="font-serif font-bold text-sm tracking-wide text-amber-200">
          Move History
        </h3>
        <span className="text-xs text-neutral-400 font-mono">
          {history.length} {history.length === 1 ? 'move' : 'moves'}
        </span>
      </div>

      {/* Move List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-xs max-h-[300px] lg:max-h-[380px]">
        {movePairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 italic text-center p-6">
            Make a move to begin recording the game
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.num}
              className="grid grid-cols-12 items-center py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="col-span-2 text-neutral-500 font-medium">
                {pair.num}.
              </span>

              {/* White move */}
              <button
                onClick={() => onJumpToMove(pair.whiteIdx)}
                className={`col-span-5 text-left px-2 py-0.5 rounded font-semibold transition-all ${
                  currentStep === pair.whiteIdx
                    ? 'active-move-step bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-200 hover:text-amber-300'
                }`}
              >
                {pair.white.san}
              </button>

              {/* Black move */}
              {pair.black ? (
                <button
                  onClick={() => onJumpToMove(pair.blackIdx)}
                  className={`col-span-5 text-left px-2 py-0.5 rounded font-semibold transition-all ${
                    currentStep === pair.blackIdx
                      ? 'active-move-step bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-200 hover:text-amber-300'
                  }`}
                >
                  {pair.black.san}
                </button>
              ) : (
                <div className="col-span-5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Move Stepper Controls */}
      <div className="px-3 py-2 border-t border-white/10 bg-neutral-900/60 flex items-center justify-between gap-1">
        <button
          onClick={() => onJumpToMove(-1)}
          disabled={currentStep === -1}
          title="Jump to Start"
          className="p-1.5 rounded-lg glass-button disabled:opacity-30 text-neutral-300"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onUndo}
          disabled={currentStep === -1}
          title="Step Backward (Undo)"
          className="p-1.5 rounded-lg glass-button disabled:opacity-30 text-neutral-300"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={currentStep >= history.length - 1}
          title="Step Forward (Redo)"
          className="p-1.5 rounded-lg glass-button disabled:opacity-30 text-neutral-300"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onJumpToMove(history.length - 1)}
          disabled={currentStep >= history.length - 1}
          title="Jump to Latest"
          className="p-1.5 rounded-lg glass-button disabled:opacity-30 text-neutral-300"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hint Alert if requested */}
      {hintData && (
        <div className="mx-3 my-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Recommended: {hintData.san} ({hintData.from} → {hintData.to})</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-snug">{hintData.reason}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-neutral-950/40">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onGetHint}
            disabled={gameOver}
            className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Move Hint
          </button>
          <button
            onClick={onFlipBoard}
            className="py-2 px-3 rounded-xl glass-button text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Flip Board
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onResign(turn)}
            disabled={gameOver}
            title="Resign current turn"
            className="py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-40"
          >
            <Flag className="w-3 h-3" />
            Resign
          </button>
          <button
            onClick={onOfferDraw}
            disabled={gameOver}
            title="Offer / Agree to Draw"
            className="py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-all disabled:opacity-40"
          >
            <Handshake className="w-3 h-3" />
            Draw
          </button>
          <button
            onClick={() => onResetGame()}
            title="New Game"
            className="py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-neutral-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
          >
            New Game
          </button>
        </div>

        {/* PGN / FEN Utility row */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400 gap-1">
          <button
            onClick={handleDownloadPgn}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            title="Download .pgn"
          >
            <Download className="w-3.5 h-3.5" />
            PGN
          </button>
          <button
            onClick={handleCopyPgn}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            title="Copy PGN"
          >
            {copiedPgn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy PGN
          </button>
          <button
            onClick={handleCopyFen}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            title="Copy FEN"
          >
            {copiedFen ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            FEN
          </button>
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            title="Import PGN/FEN"
          >
            <Upload className="w-3.5 h-3.5" />
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
