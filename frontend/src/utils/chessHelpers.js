// Chess helper functions for material scoring, notation, and square mappings

export const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const PIECE_NAMES = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

// Calculate captured pieces and material differences
export function calculateCapturedPieces(moveHistory) {
  const whiteCaptured = [];
  const blackCaptured = [];
  let whiteMaterial = 0;
  let blackMaterial = 0;

  for (const move of moveHistory) {
    if (move.captured) {
      if (move.color === 'w') {
        // White captured a black piece
        whiteCaptured.push(move.captured);
        whiteMaterial += PIECE_VALUES[move.captured] || 0;
      } else {
        // Black captured a white piece
        blackCaptured.push(move.captured);
        blackMaterial += PIECE_VALUES[move.captured] || 0;
      }
    }
  }

  // Sorting captured pieces by value descending (Q, R, B, N, P)
  const pieceOrder = { q: 5, r: 4, b: 3, n: 2, p: 1 };
  whiteCaptured.sort((a, b) => (pieceOrder[b] || 0) - (pieceOrder[a] || 0));
  blackCaptured.sort((a, b) => (pieceOrder[b] || 0) - (pieceOrder[a] || 0));

  return {
    captured: {
      w: whiteCaptured, // captured from black by white
      b: blackCaptured, // captured from white by black
    },
    advantage: {
      w: Math.max(0, whiteMaterial - blackMaterial),
      b: Math.max(0, blackMaterial - whiteMaterial),
    },
  };
}

// Convert seconds into MM:SS format
export function formatTime(seconds) {
  if (seconds === null || seconds === undefined || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  const sStr = secs < 10 ? `0${secs}` : `${secs}`;
  return `${mStr}:${sStr}`;
}

// Generate PGN file content with standard headers
export function exportPGNContent(chessInstance, metadata = {}) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '.');
  const headers = [
    `[Event "${metadata.event || 'Casual Game'}"]`,
    `[Site "${metadata.site || 'Grandmaster Chess Web'}"]`,
    `[Date "${date}"]`,
    `[Round "1"]`,
    `[White "${metadata.white || 'Player 1'}"]`,
    `[Black "${metadata.black || 'Player 2'}"]`,
    `[Result "${metadata.result || '*'}"]`,
    `[TimeControl "${metadata.timeControl || '-'}"]`,
  ];

  return `${headers.join('\n')}\n\n${chessInstance.pgn()}`;
}

// Trigger browser download for PGN file
export function downloadPGN(pgnString, filename = 'game.pgn') {
  const blob = new Blob([pgnString], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Check if a move is a pawn promotion attempt
export function isPromotionMove(chess, from, to) {
  const piece = chess.get(from);
  if (!piece || piece.type !== 'p') return false;

  const toRank = to[1];
  return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
}
