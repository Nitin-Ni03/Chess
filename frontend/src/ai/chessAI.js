import { Chess } from 'chess.js';

// Piece base values in centipawns
const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (from White's perspective, 8x8 matrix rank 8 down to rank 1)
const PST_PAWN = [
  [ 0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [ 5,  5, 10, 25, 25, 10,  5,  5],
  [ 0,  0,  0, 20, 20,  0,  0,  0],
  [ 5, -5,-10,  0,  0,-10, -5,  5],
  [ 5, 10, 10,-20,-20, 10, 10,  5],
  [ 0,  0,  0,  0,  0,  0,  0,  0]
];

const PST_KNIGHT = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

const PST_BISHOP = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
];

const PST_ROOK = [
  [  0,  0,  0,  0,  0,  0,  0,  0],
  [  5, 10, 10, 10, 10, 10, 10,  5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [ -5,  0,  0,  0,  0,  0,  0, -5],
  [  0,  0,  0,  5,  5,  0,  0,  0]
];

const PST_QUEEN = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [ -5,  0,  5,  5,  5,  5,  0, -5],
  [  0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
];

const PST_KING_MID = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [ 20, 20,  0,  0,  0,  0, 20, 20],
  [ 20, 30, 10,  0,  0, 10, 30, 20]
];

const TABLES = {
  p: PST_PAWN,
  n: PST_KNIGHT,
  b: PST_BISHOP,
  r: PST_ROOK,
  q: PST_QUEEN,
  k: PST_KING_MID,
};

// Evaluate board position from White's perspective (+ means White is winning)
export function evaluateBoard(chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -100000 : 100000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let totalScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const pieceVal = PIECE_VALUES[piece.type] || 0;
      const table = TABLES[piece.type];
      
      // Calculate positional bonus
      let posVal = 0;
      if (table) {
        // If black, mirror row
        const row = piece.color === 'w' ? r : 7 - r;
        posVal = table[row][c];
      }

      const score = pieceVal + posVal;
      totalScore += piece.color === 'w' ? score : -score;
    }
  }

  return totalScore;
}

// Convert centipawns to standard pawn value (e.g. +150 -> +1.5)
export function getPositionEvalScore(chess) {
  const centipawns = evaluateBoard(chess);
  return centipawns / 100;
}

// Move ordering heuristic: captures & promotions first to maximize Alpha-Beta cutoffs
function orderMoves(moves) {
  return [...moves].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    }
    if (a.promotion) {
      scoreA += (PIECE_VALUES[a.promotion] || 0) * 5;
    }

    if (b.captured) {
      scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    }
    if (b.promotion) {
      scoreB += (PIECE_VALUES[b.promotion] || 0) * 5;
    }

    return scoreB - scoreA;
  });
}

// Quiescence search to avoid horizon effect on captures
function quiescence(chess, alpha, beta, isMaximizing, depth = 2) {
  const standPat = evaluateBoard(chess);
  if (depth === 0) return standPat;

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;

    const captures = orderMoves(chess.moves({ verbose: true }).filter(m => m.captured));
    for (const move of captures) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, false, depth - 1);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (beta > standPat) beta = standPat;

    const captures = orderMoves(chess.moves({ verbose: true }).filter(m => m.captured));
    for (const move of captures) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, true, depth - 1);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

// Minimax with Alpha-Beta Pruning
function minimax(chess, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || chess.isGameOver()) {
    return quiescence(chess, alpha, beta, isMaximizing, 1);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha cutoff
    }
    return minEval;
  }
}

// Find best move for a given difficulty
export function findBestMove(chess, difficulty = 'medium') {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  // 1. Easy Mode: Casual play with 20% random exploration and depth 1 lookahead
  if (difficulty === 'easy') {
    if (Math.random() < 0.25) {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }
    // Simple 1-ply evaluation with slight noise
    let bestMove = legalMoves[0];
    let bestScore = chess.turn() === 'w' ? -Infinity : Infinity;

    for (const move of legalMoves) {
      chess.move(move);
      const score = evaluateBoard(chess) + (Math.random() * 40 - 20);
      chess.undo();

      if (chess.turn() === 'w' ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // 2. Medium Mode: Depth 2 Minimax
  if (difficulty === 'medium') {
    const isMaximizing = chess.turn() === 'w';
    let bestMove = legalMoves[0];
    let bestScore = isMaximizing ? -Infinity : Infinity;

    const ordered = orderMoves(legalMoves);
    for (const move of ordered) {
      chess.move(move);
      const score = minimax(chess, 2, -Infinity, Infinity, !isMaximizing);
      chess.undo();

      if (isMaximizing ? score > bestScore : score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // 3. Hard Mode: Depth 3 Minimax with Alpha-Beta Pruning
  const isMaximizing = chess.turn() === 'w';
  let bestMove = legalMoves[0];
  let bestScore = isMaximizing ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  const ordered = orderMoves(legalMoves);

  // Deepen search if few pieces remain (endgame)
  const piecesCount = chess.board().flat().filter(Boolean).length;
  const searchDepth = piecesCount <= 10 ? 4 : 3;

  for (const move of ordered) {
    chess.move(move);
    const score = minimax(chess, searchDepth - 1, alpha, beta, !isMaximizing);
    chess.undo();

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
    }

    if (beta <= alpha) break;
  }

  return bestMove;
}

// Generate move suggestion / hint for player
export function getMoveHint(chess) {
  const bestMove = findBestMove(chess, 'hard');
  if (!bestMove) return null;

  let reason = 'Solid positional development';
  if (bestMove.captured) {
    reason = `Captures opponent's ${bestMove.captured.toUpperCase()} winning material`;
  } else if (bestMove.san.includes('+')) {
    reason = 'Puts opposing King in check!';
  } else if (bestMove.san.includes('O-O')) {
    reason = 'Safeties the king and connects rooks';
  } else if (['e4', 'd4', 'e5', 'd5'].includes(bestMove.to)) {
    reason = 'Secures dominance over the central squares';
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    san: bestMove.san,
    reason,
  };
}
