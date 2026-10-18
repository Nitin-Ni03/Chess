import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { soundService } from '../services/soundService';
import { calculateCapturedPieces, isPromotionMove } from '../utils/chessHelpers';

// Convert timeControl string (e.g. '10+0', '3+2', 'unlimited') to seconds and increment
function parseTimeControl(tc) {
  if (!tc || tc === 'unlimited') return { initialSeconds: null, increment: 0 };
  const parts = tc.split('+');
  const mins = parseInt(parts[0], 10) || 10;
  const inc = parseInt(parts[1], 10) || 0;
  return { initialSeconds: mins * 60, increment: inc };
}

export function useChessGame(initialTimeControl = '10+0') {
  // Underlying chess engine instance
  const chessRef = useRef(new Chess());
  const chess = chessRef.current;

  // React state reflecting current game status
  const [fen, setFen] = useState(() => chess.fen());
  const [turn, setTurn] = useState(() => chess.turn());
  const [isCheck, setIsCheck] = useState(false);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [drawReason, setDrawReason] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null); // 'w' | 'b' | 'draw'
  const [winReason, setWinReason] = useState('');

  // Move tracking & history navigation
  // Each history entry: { san, from, to, piece, color, captured, fen, flags }
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1); // -1 = start, 0 = after move 1, etc.
  const [lastMove, setLastMove] = useState(null); // { from, to }

  // Promotion handling
  const [pendingPromotion, setPendingPromotion] = useState(null); // { from, to }

  // Timers & clocks
  const [timeControl, setTimeControl] = useState(initialTimeControl);
  const { initialSeconds, increment } = useMemo(() => parseTimeControl(timeControl), [timeControl]);
  const [timers, setTimers] = useState({ w: initialSeconds, b: initialSeconds });
  const [activeClock, setActiveClock] = useState(null); // 'w' | 'b' | null

  // Redo stack for move undo/redo
  const redoStackRef = useRef([]);

  // Check king position
  const getKingSquare = useCallback((color) => {
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          const files = 'abcdefgh';
          return `${files[c]}${8 - r}`;
        }
      }
    }
    return null;
  }, [chess]);

  // Synchronize React state from chess.js instance
  const syncGameState = useCallback(() => {
    const currentFen = chess.fen();
    setFen(currentFen);
    setTurn(chess.turn());

    const check = chess.inCheck();
    const checkmate = chess.isCheckmate();
    const stalemate = chess.isStalemate();
    const threeFold = chess.isThreefoldRepetition();
    const fiftyMoves = chess.isDrawByFiftyMoves();
    const insufficient = chess.isInsufficientMaterial();
    const draw = chess.isDraw();

    setIsCheck(check);
    setIsCheckmate(checkmate);
    setIsStalemate(stalemate);
    setIsDraw(draw);

    if (checkmate) {
      setGameOver(true);
      const winColor = chess.turn() === 'w' ? 'b' : 'w';
      setWinner(winColor);
      setWinReason('Checkmate');
      setActiveClock(null);
      soundService.playCheckmate();
    } else if (stalemate) {
      setGameOver(true);
      setWinner('draw');
      setDrawReason('stalemate');
      setWinReason('Stalemate');
      setActiveClock(null);
      soundService.playCheckmate();
    } else if (threeFold) {
      setGameOver(true);
      setWinner('draw');
      setDrawReason('threefold');
      setWinReason('Threefold Repetition');
      setActiveClock(null);
    } else if (fiftyMoves) {
      setGameOver(true);
      setWinner('draw');
      setDrawReason('50-move');
      setWinReason('50-Move Rule');
      setActiveClock(null);
    } else if (insufficient) {
      setGameOver(true);
      setWinner('draw');
      setDrawReason('insufficient');
      setWinReason('Insufficient Material');
      setActiveClock(null);
    } else if (check) {
      soundService.playCheck();
    }
  }, [chess]);

  // Make move execution
  const executeMove = useCallback((from, to, promotion = 'q') => {
    if (gameOver) return false;

    // Check if in historical review mode: if user makes a move while viewing history, chop future history
    if (currentStep < history.length - 1 && currentStep >= -1) {
      // Re-load chess from currentStep FEN
      const targetFen = currentStep >= 0 ? history[currentStep].fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      chess.load(targetFen);
      setHistory(prev => prev.slice(0, currentStep + 1));
    }

    // Check promotion need
    if (isPromotionMove(chess, from, to) && !promotion) {
      setPendingPromotion({ from, to });
      return 'PROMOTION_REQUIRED';
    }

    try {
      const moveResult = chess.move({
        from,
        to,
        promotion: promotion || 'q',
      });

      if (!moveResult) return false;

      // Clear redo stack on new move
      redoStackRef.current = [];

      // Determine sound effect
      if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
        soundService.playCastle();
      } else if (moveResult.captured) {
        soundService.playCapture();
      } else if (moveResult.promotion) {
        soundService.playPromotion();
      } else {
        soundService.playMove();
      }

      // Record to history
      const newHistoryItem = {
        san: moveResult.san,
        from: moveResult.from,
        to: moveResult.to,
        piece: moveResult.piece,
        color: moveResult.color,
        captured: moveResult.captured || null,
        promotion: moveResult.promotion || null,
        fen: chess.fen(),
        flags: moveResult.flags,
      };

      setHistory(prev => [...prev, newHistoryItem]);
      setCurrentStep(prev => prev + 1);
      setLastMove({ from: moveResult.from, to: moveResult.to });
      setPendingPromotion(null);

      // Handle clock increment and switch
      if (initialSeconds !== null) {
        setTimers(prev => ({
          ...prev,
          [moveResult.color]: prev[moveResult.color] + increment,
        }));
        setActiveClock(moveResult.color === 'w' ? 'b' : 'w');
      }

      syncGameState();
      return moveResult;
    } catch {
      return false;
    }
  }, [chess, gameOver, currentStep, history, initialSeconds, increment, syncGameState]);

  // Handle promotion modal selection
  const confirmPromotion = useCallback((promoPiece) => {
    if (!pendingPromotion) return;
    executeMove(pendingPromotion.from, pendingPromotion.to, promoPiece);
    setPendingPromotion(null);
  }, [pendingPromotion, executeMove]);

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  // Jump to specific point in move history
  const jumpToMove = useCallback((stepIndex) => {
    if (stepIndex < -1 || stepIndex >= history.length) return;
    setCurrentStep(stepIndex);

    const targetFen = stepIndex === -1
      ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      : history[stepIndex].fen;

    chess.load(targetFen);
    setFen(chess.fen());
    setTurn(chess.turn());
    setIsCheck(chess.inCheck());

    if (stepIndex >= 0) {
      setLastMove({ from: history[stepIndex].from, to: history[stepIndex].to });
    } else {
      setLastMove(null);
    }
  }, [chess, history]);

  // Undo move
  const undoMove = useCallback(() => {
    if (history.length === 0 || currentStep < 0) return;
    const targetStep = currentStep - 1;
    jumpToMove(targetStep);
  }, [history, currentStep, jumpToMove]);

  // Redo move
  const redoMove = useCallback(() => {
    if (currentStep >= history.length - 1) return;
    const targetStep = currentStep + 1;
    jumpToMove(targetStep);
  }, [history, currentStep, jumpToMove]);

  // Resign game
  const resign = useCallback((color) => {
    if (gameOver) return;
    setGameOver(true);
    const winColor = color === 'w' ? 'b' : 'w';
    setWinner(winColor);
    setWinReason(`${color === 'w' ? 'White' : 'Black'} Resigned`);
    setActiveClock(null);
    soundService.playCheckmate();
  }, [gameOver]);

  // Offer / Agree draw
  const agreeDraw = useCallback(() => {
    if (gameOver) return;
    setGameOver(true);
    setWinner('draw');
    setDrawReason('agreement');
    setWinReason('Draw by Agreement');
    setActiveClock(null);
  }, [gameOver]);

  // Reset or start a new game
  const resetGame = useCallback((newTc) => {
    chess.reset();
    const newFen = chess.fen();
    setFen(newFen);
    setTurn(chess.turn());
    setIsCheck(false);
    setIsCheckmate(false);
    setIsStalemate(false);
    setIsDraw(false);
    setDrawReason(null);
    setGameOver(false);
    setWinner(null);
    setWinReason('');
    setHistory([]);
    setCurrentStep(-1);
    setLastMove(null);
    setPendingPromotion(null);
    redoStackRef.current = [];

    const tcToUse = newTc || timeControl;
    if (newTc) setTimeControl(newTc);
    const { initialSeconds: s } = parseTimeControl(tcToUse);
    setTimers({ w: s, b: s });
    setActiveClock(null);
  }, [chess, timeControl]);

  // Load custom FEN position
  const loadFEN = useCallback((newFen) => {
    try {
      chess.load(newFen);
      syncGameState();
      setHistory([]);
      setCurrentStep(-1);
      setLastMove(null);
      setPendingPromotion(null);
      return true;
    } catch {
      return false;
    }
  }, [chess, syncGameState]);

  // Load PGN notation
  const loadPGN = useCallback((pgnString) => {
    try {
      const tempChess = new Chess();
      tempChess.loadPgn(pgnString);
      const moves = tempChess.history({ verbose: true });

      // Reset and replay
      chess.reset();
      const newHistory = [];
      for (const m of moves) {
        chess.move(m);
        newHistory.push({
          san: m.san,
          from: m.from,
          to: m.to,
          piece: m.piece,
          color: m.color,
          captured: m.captured || null,
          promotion: m.promotion || null,
          fen: chess.fen(),
          flags: m.flags,
        });
      }

      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
      setLastMove(newHistory.length > 0 ? { from: newHistory[newHistory.length - 1].from, to: newHistory[newHistory.length - 1].to } : null);
      syncGameState();
      return true;
    } catch {
      return false;
    }
  }, [chess, syncGameState]);

  // Clock countdown interval
  useEffect(() => {
    if (!activeClock || gameOver || initialSeconds === null) return;

    const interval = setInterval(() => {
      setTimers(prev => {
        const remaining = prev[activeClock] - 1;
        if (remaining <= 0) {
          clearInterval(interval);
          setGameOver(true);
          const winColor = activeClock === 'w' ? 'b' : 'w';
          setWinner(winColor);
          setWinReason(`${activeClock === 'w' ? 'White' : 'Black'} Timeout`);
          setActiveClock(null);
          soundService.playCheckmate();
          return { ...prev, [activeClock]: 0 };
        }
        return { ...prev, [activeClock]: remaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeClock, gameOver, initialSeconds]);

  // Compute captured pieces and material differences
  const { captured, advantage } = useMemo(() => {
    // Only count captured pieces up to currentStep
    const activeHistory = currentStep >= 0 ? history.slice(0, currentStep + 1) : [];
    return calculateCapturedPieces(activeHistory);
  }, [history, currentStep]);

  // Get legal moves for a given square
  const getPossibleMoves = useCallback((square) => {
    if (gameOver) return [];
    try {
      const moves = chess.moves({ square, verbose: true });
      return moves.map(m => ({
        to: m.to,
        isCapture: !!m.captured,
        flags: m.flags,
      }));
    } catch {
      return [];
    }
  }, [chess, gameOver]);

  return {
    chess,
    fen,
    turn,
    board: chess.board(),
    isCheck,
    isCheckmate,
    isStalemate,
    isDraw,
    drawReason,
    gameOver,
    winner,
    winReason,
    history,
    currentStep,
    lastMove,
    pendingPromotion,
    timers,
    activeClock,
    timeControl,
    captured,
    advantage,
    getKingSquare,
    getPossibleMoves,
    executeMove,
    confirmPromotion,
    cancelPromotion,
    jumpToMove,
    undoMove,
    redoMove,
    resign,
    agreeDraw,
    resetGame,
    loadFEN,
    loadPGN,
    setTimeControl,
  };
}
