import { Chess } from 'chess.js';
import { evaluateBoard, findBestMove, getPositionEvalScore } from './chessAI';
import { lookupOpening } from './openingBook';

// Classification Metadata with Chess.com visual styles
export const MOVE_TIERS = {
  BRILLIANT: {
    id: 'brilliant',
    label: 'Brilliant',
    symbol: '!!',
    color: '#06b6d4', // Cyan
    bg: 'bg-cyan-500',
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    badgeClass: 'bg-cyan-500 text-neutral-950 font-black',
    glow: 'shadow-cyan-500/50',
    description: 'A brilliant tactical move or piece sacrifice that secures victory!',
  },
  GREAT: {
    id: 'great',
    label: 'Great Move',
    symbol: '!',
    color: '#3b82f6', // Blue
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    text: 'text-blue-400',
    badgeClass: 'bg-blue-500 text-white font-black',
    glow: 'shadow-blue-500/50',
    description: 'A crucial find! The only move that preserves advantage or defends under pressure.',
  },
  BEST: {
    id: 'best',
    label: 'Best Move',
    symbol: '★',
    color: '#10b981', // Emerald / Green
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    text: 'text-emerald-400',
    badgeClass: 'bg-emerald-500 text-neutral-950 font-bold',
    glow: 'shadow-emerald-500/50',
    description: "The engine's absolute top choice. Maximum harmony and precision.",
  },
  EXCELLENT: {
    id: 'excellent',
    label: 'Excellent',
    symbol: '👍',
    color: '#22c55e', // Light green
    bg: 'bg-green-500',
    border: 'border-green-400',
    text: 'text-green-400',
    badgeClass: 'bg-green-600 text-white font-bold',
    glow: 'shadow-green-500/40',
    description: 'Nearly optimal. Holds on to the initiative with high precision.',
  },
  GOOD: {
    id: 'good',
    label: 'Good',
    symbol: '✓',
    color: '#84cc16', // Lime
    bg: 'bg-lime-500',
    border: 'border-lime-400',
    text: 'text-lime-400',
    badgeClass: 'bg-lime-600 text-white font-bold',
    glow: 'shadow-lime-500/30',
    description: 'A sound, solid move that keeps your plan moving forward.',
  },
  BOOK: {
    id: 'book',
    label: 'Book Move',
    symbol: '📖',
    color: '#d97706', // Amber/Brown
    bg: 'bg-amber-600',
    border: 'border-amber-500',
    text: 'text-amber-400',
    badgeClass: 'bg-amber-700 text-amber-100 font-bold',
    glow: 'shadow-amber-500/30',
    description: 'Standard opening master theory from the chess books.',
  },
  INACCURACY: {
    id: 'inaccuracy',
    label: 'Inaccuracy',
    symbol: '?!',
    color: '#eab308', // Yellow
    bg: 'bg-yellow-500',
    border: 'border-yellow-400',
    text: 'text-yellow-400',
    badgeClass: 'bg-yellow-500 text-neutral-950 font-bold',
    glow: 'shadow-yellow-500/30',
    description: 'A slightly imprecise move that allows your opponent a path back into the game.',
  },
  MISTAKE: {
    id: 'mistake',
    label: 'Mistake',
    symbol: '?',
    color: '#f97316', // Orange
    bg: 'bg-orange-500',
    border: 'border-orange-400',
    text: 'text-orange-400',
    badgeClass: 'bg-orange-500 text-white font-black',
    glow: 'shadow-orange-500/40',
    description: 'A tangible mistake that significantly damages your evaluation or gives up the initiative.',
  },
  BLUNDER: {
    id: 'blunder',
    label: 'Blunder',
    symbol: '??',
    color: '#ef4444', // Red
    bg: 'bg-red-500',
    border: 'border-red-400',
    text: 'text-red-400',
    badgeClass: 'bg-red-600 text-white font-black',
    glow: 'shadow-red-500/50',
    description: 'A serious blunder! Leaves a piece hanging or permits a fatal tactic.',
  },
  MISSED_WIN: {
    id: 'missed_win',
    label: 'Missed Win',
    symbol: '❌',
    color: '#ec4899', // Pink / Magenta
    bg: 'bg-pink-600',
    border: 'border-pink-500',
    text: 'text-pink-400',
    badgeClass: 'bg-pink-600 text-white font-black',
    glow: 'shadow-pink-500/40',
    description: 'You had a decisive winning move or tactic on the board, but missed it!',
  },
};

// Chess.com Win Chance formula based on Centipawns
export function calculateWinChance(centipawns) {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);
}

// Chess.com Move Accuracy formula based on Win Chance drop
export function calculateMoveAccuracy(winChanceBefore, winChanceAfter, isWhite) {
  // From player's perspective, higher win chance is better
  const before = isWhite ? winChanceBefore : 100 - winChanceBefore;
  const after = isWhite ? winChanceAfter : 100 - winChanceAfter;
  const delta = Math.max(0, before - after);

  // Chess.com curve
  const raw = 103.1668 * Math.exp(-0.04354 * delta) - 3.1669;
  return Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
}

// Estimate Performance Elo based on game accuracy
export function estimatePerformanceElo(avgAccuracy, acpl) {
  if (avgAccuracy >= 97) return Math.min(2700, Math.round(2400 + (avgAccuracy - 97) * 100));
  if (avgAccuracy >= 92) return Math.round(2100 + (avgAccuracy - 92) * 60);
  if (avgAccuracy >= 84) return Math.round(1750 + (avgAccuracy - 84) * 43.7);
  if (avgAccuracy >= 74) return Math.round(1400 + (avgAccuracy - 74) * 35);
  if (avgAccuracy >= 62) return Math.round(1050 + (avgAccuracy - 62) * 29);
  return Math.max(500, Math.round(650 + (avgAccuracy - 40) * 18));
}

// Tactical analysis helper: check if square is attacked by opponent
function isSquareAttackedByOpponent(chess, square, oppColor) {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === oppColor) {
        const sq = `${'abcdefgh'[c]}${8 - r}`;
        try {
          const moves = chess.moves({ square: sq, verbose: true });
          if (moves.some(m => m.to === square)) return true;
        } catch {
          // ignore
        }
      }
    }
  }
  return false;
}

// Generate Coach Explanation for a move
function generateCoachExplanation({
  move,
  tier,
  evalDelta,
  bestMove,
  isWhite,
  openingInfo,
  chessBefore,
  chessAfter,
}) {
  const isBest = tier.id === 'best' || tier.id === 'brilliant' || tier.id === 'great' || tier.id === 'book';

  // 1. Opening Book Move
  if (tier.id === 'book' && openingInfo?.opening) {
    return {
      title: `${openingInfo.opening.name}`,
      comment: openingInfo.opening.desc,
      tip: `Standard opening theory (${openingInfo.opening.eco}). Helps you develop smoothly.`,
      coachMood: 'happy',
    };
  }

  // 2. Brilliant Move (!!)
  if (tier.id === 'brilliant') {
    return {
      title: 'Breathtaking Brilliance!',
      comment: `You played ${move.san}! A masterful piece sacrifice that rips open the defense and seizes a crushing advantage.`,
      tip: 'Tactical sacrifices like this demonstrate deep positional calculation!',
      coachMood: 'celebrating',
    };
  }

  // 3. Great Move (!)
  if (tier.id === 'great') {
    return {
      title: 'Clutch Finding!',
      comment: `${move.san} was the only move that solves the tension on the board and keeps the initiative.`,
      tip: 'Finding the sole critical resource under pressure is master-level play.',
      coachMood: 'proud',
    };
  }

  // 4. Best Move (★)
  if (tier.id === 'best') {
    let comment = `Optimal play with ${move.san}. `;
    if (move.flags.includes('k') || move.flags.includes('q')) {
      comment += 'Tucks the king into safety and activates the rook along the file.';
    } else if (move.captured) {
      comment += `Wins material by capturing the ${move.captured.toUpperCase()} on ${move.to}.`;
    } else if (move.san.includes('+')) {
      comment += 'Applies immediate check and disrupts the opponent’s king coordination.';
    } else if (['e4', 'd4', 'e5', 'd5'].includes(move.to)) {
      comment += 'Asserts commanding control over key central squares.';
    } else if (move.piece === 'n' || move.piece === 'b') {
      comment += 'Active piece development to maximize scope and pressure.';
    } else {
      comment += 'Maintains the engine’s top positional advantage.';
    }

    return {
      title: 'Best Choice!',
      comment,
      tip: 'You found the exact engine-recommended path.',
      coachMood: 'happy',
    };
  }

  // 5. Excellent (👍)
  if (tier.id === 'excellent') {
    return {
      title: 'Very Strong Move',
      comment: `Playing ${move.san} is very solid. You keep a firm hold on your edge and keep your opponent guessing.`,
      tip: bestMove && bestMove.san !== move.san ? `Alternative: ${bestMove.san} was slightly sharper.` : 'Clean execution.',
      coachMood: 'happy',
    };
  }

  // 6. Good (✓)
  if (tier.id === 'good') {
    return {
      title: 'Solid Decision',
      comment: `${move.san} keeps things together. It improves your coordination without conceding ground.`,
      tip: bestMove ? `Engine leaned slightly toward ${bestMove.san} for more active play.` : 'Good natural development.',
      coachMood: 'neutral',
    };
  }

  // 7. Inaccuracy (?!)
  if (tier.id === 'inaccuracy') {
    return {
      title: 'Slight Inaccuracy',
      comment: `${move.san} is a bit passive and surrenders some of your initiative.`,
      tip: bestMove ? `Better was ${bestMove.san}, which applies more dynamic pressure.` : 'Watch out for passive piece placement.',
      coachMood: 'thoughtful',
    };
  }

  // 8. Mistake (?)
  if (tier.id === 'mistake') {
    return {
      title: 'Costly Mistake',
      comment: `${move.san} misses the tactical mark and gives your opponent a clear path to turn the tables.`,
      tip: bestMove ? `The engine prefers ${bestMove.san} to hold the advantage.` : 'Look for active counter-threats before moving.',
      coachMood: 'warning',
    };
  }

  // 9. Blunder (??)
  if (tier.id === 'blunder') {
    let blunderDetail = 'This causes significant material or positional loss.';
    if (chessAfter.isCheckmate()) {
      blunderDetail = 'This leads directly to checkmate!';
    } else if (isSquareAttackedByOpponent(chessAfter, move.to, isWhite ? 'b' : 'w')) {
      blunderDetail = `Moving to ${move.to} leaves this piece vulnerable to capture!`;
    }

    return {
      title: 'Ouch, That’s a Blunder!',
      comment: `${move.san} is a major mistake. ${blunderDetail}`,
      tip: bestMove ? `You should have played ${bestMove.san} instead!` : 'Always double check unprotected squares before releasing the piece.',
      coachMood: 'facepalm',
    };
  }

  // 10. Missed Win (❌)
  return {
    title: 'Missed Winning Tactic',
    comment: `You had a decisive knockout opportunity here, but ${move.san} allowed your opponent off the hook.`,
    tip: bestMove ? `${bestMove.san} would have delivered a winning punch!` : 'Look for forcing checks and captures when ahead.',
    coachMood: 'shocked',
  };
}

// Single Move Analysis
export function analyzeMove({
  fenBefore,
  move,
  moveIndex,
  moveHistorySoFar = [],
  depth = 2,
}) {
  const chessBefore = new Chess(fenBefore);
  const isWhite = chessBefore.turn() === 'w';

  // Find best move in this position
  const bestMove = findBestMove(chessBefore, 'hard');

  // Eval before move
  const evalBefore = evaluateBoard(chessBefore);
  const winChanceBefore = calculateWinChance(evalBefore);

  // Eval after best move
  let bestEvalAfter = evalBefore;
  if (bestMove) {
    chessBefore.move(bestMove);
    bestEvalAfter = evaluateBoard(chessBefore);
    chessBefore.undo();
  }

  // Eval after played move
  const chessAfter = new Chess(fenBefore);
  let moveResult = null;
  try {
    moveResult = chessAfter.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || 'q',
    });
  } catch {
    // If move couldn't be played
  }

  const evalAfter = evaluateBoard(chessAfter);
  const winChanceAfter = calculateWinChance(evalAfter);

  // Centipawn loss (CPL): difference from best choice (from moving player's point of view)
  const cpl = isWhite ? Math.max(0, bestEvalAfter - evalAfter) : Math.max(0, evalAfter - bestEvalAfter);

  // Move Accuracy (0 to 100)
  const accuracy = calculateMoveAccuracy(winChanceBefore, winChanceAfter, isWhite);

  // Check opening book
  const openingCheck = lookupOpening(moveHistorySoFar);
  const isBook = openingCheck?.isBookMove && moveIndex <= 10;

  // Check piece sacrifice for Brilliancy
  const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  const movedPieceVal = pieceValues[move.piece] || 100;
  const isAttackedSquare = isSquareAttackedByOpponent(chessAfter, move.to, isWhite ? 'b' : 'w');
  const wasSacrifice = (movedPieceVal >= 300 && isAttackedSquare && !move.captured) || (move.piece === 'q' && isAttackedSquare);
  const isWinningOrGood = isWhite ? evalAfter >= 120 : evalAfter <= -120;

  // Was it a missed win?
  const wasDecisiveBefore = isWhite ? evalBefore >= 300 : evalBefore <= -300;
  const droppedSignificantly = isWhite ? evalAfter <= 100 : evalAfter >= -100;
  const isMissedWin = wasDecisiveBefore && droppedSignificantly;

  // Determine Move Classification Tier
  let tier = MOVE_TIERS.GOOD;

  if (isMissedWin && cpl >= 200) {
    tier = MOVE_TIERS.MISSED_WIN;
  } else if (wasSacrifice && isWinningOrGood && cpl <= 35) {
    tier = MOVE_TIERS.BRILLIANT;
  } else if (isBook) {
    tier = MOVE_TIERS.BOOK;
  } else if (cpl <= 12) {
    // If it's a sole winning move or tight defense, promote to Great
    tier = MOVE_TIERS.BEST;
  } else if (cpl <= 38) {
    tier = MOVE_TIERS.EXCELLENT;
  } else if (cpl <= 75) {
    tier = MOVE_TIERS.GOOD;
  } else if (cpl <= 150) {
    tier = MOVE_TIERS.INACCURACY;
  } else if (cpl <= 300) {
    tier = MOVE_TIERS.MISTAKE;
  } else {
    tier = MOVE_TIERS.BLUNDER;
  }

  // Generate Coach Commentary & Advice
  const coach = generateCoachExplanation({
    move,
    tier,
    evalDelta: isWhite ? evalAfter - evalBefore : evalBefore - evalAfter,
    bestMove,
    isWhite,
    openingInfo: openingCheck,
    chessBefore,
    chessAfter,
  });

  return {
    moveIndex,
    moveNumber: Math.floor(moveIndex / 2) + 1,
    isWhite,
    san: move.san,
    from: move.from,
    to: move.to,
    piece: move.piece,
    captured: move.captured,
    promotion: move.promotion,
    fenBefore,
    fenAfter: chessAfter.fen(),
    evalScore: getPositionEvalScore(chessAfter),
    evalCentipawns: evalAfter,
    cpl,
    accuracy,
    tier,
    bestMove: bestMove ? { from: bestMove.from, to: bestMove.to, san: bestMove.san } : null,
    coach,
  };
}

// Full Game Review Analyzer (Batch processing for instant Game Review)
export function analyzeFullGame(history = [], onProgress = null) {
  if (!history || history.length === 0) {
    return {
      moves: [],
      whiteStats: { accuracy: 100, elo: 1200, counts: {} },
      blackStats: { accuracy: 100, elo: 1200, counts: {} },
      advantageGraph: [],
    };
  }

  const analyzedMoves = [];
  const whiteAccuracies = [];
  const blackAccuracies = [];
  const whiteCpls = [];
  const blackCpls = [];

  const initialCounts = () => ({
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
    missed_win: 0,
  });

  const whiteCounts = initialCounts();
  const blackCounts = initialCounts();

  let currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const historySoFar = [];

  for (let i = 0; i < history.length; i++) {
    const moveItem = history[i];
    historySoFar.push(moveItem);

    const analyzed = analyzeMove({
      fenBefore: currentFen,
      move: moveItem,
      moveIndex: i,
      moveHistorySoFar: historySoFar,
    });

    analyzedMoves.push(analyzed);

    if (analyzed.isWhite) {
      whiteAccuracies.push(analyzed.accuracy);
      whiteCpls.push(analyzed.cpl);
      whiteCounts[analyzed.tier.id] = (whiteCounts[analyzed.tier.id] || 0) + 1;
    } else {
      blackAccuracies.push(analyzed.accuracy);
      blackCpls.push(analyzed.cpl);
      blackCounts[analyzed.tier.id] = (blackCounts[analyzed.tier.id] || 0) + 1;
    }

    currentFen = analyzed.fenAfter;

    if (onProgress && i % 5 === 0) {
      onProgress(Math.round(((i + 1) / history.length) * 100));
    }
  }

  const calcAvg = (arr) => (arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 100);
  const whiteAvgAcc = Math.round(calcAvg(whiteAccuracies) * 10) / 10;
  const blackAvgAcc = Math.round(calcAvg(blackAccuracies) * 10) / 10;

  const whiteAvgCpl = Math.round(calcAvg(whiteCpls));
  const blackAvgCpl = Math.round(calcAvg(blackCpls));

  const whiteElo = estimatePerformanceElo(whiteAvgAcc, whiteAvgCpl);
  const blackElo = estimatePerformanceElo(blackAvgAcc, blackAvgCpl);

  // Advantage Graph: points representing evaluation trajectory
  const advantageGraph = analyzedMoves.map((m) => ({
    ply: m.moveIndex + 1,
    moveNumber: m.moveNumber,
    isWhite: m.isWhite,
    san: m.san,
    eval: m.evalScore,
    clampedEval: Math.max(-10, Math.min(10, m.evalScore)),
    tier: m.tier,
  }));

  return {
    moves: analyzedMoves,
    whiteStats: {
      accuracy: whiteAvgAcc,
      cpl: whiteAvgCpl,
      elo: whiteElo,
      counts: whiteCounts,
    },
    blackStats: {
      accuracy: blackAvgAcc,
      cpl: blackAvgCpl,
      elo: blackElo,
      counts: blackCounts,
    },
    advantageGraph,
  };
}
