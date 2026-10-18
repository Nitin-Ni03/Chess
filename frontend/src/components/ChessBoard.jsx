import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChessPiece } from './ChessPieces';

export function ChessBoard({
  chess,
  turn,
  is3d = true,
  theme = 'wood',
  flipped = false,
  lastMove = null,
  isCheck = false,
  getKingSquare,
  getPossibleMoves,
  onMove,
  threatDetection = false,
  customLightColor = '',
  customDarkColor = '',
  disabled = false,
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [draggingSquare, setDraggingSquare] = useState(null);

  // Files & ranks based on flip orientation
  const files = useMemo(() => (flipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']), [flipped]);
  const ranks = useMemo(() => (flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]), [flipped]);

  // King in check square
  const checkedKingSquare = useMemo(() => {
    if (!isCheck) return null;
    return getKingSquare ? getKingSquare(turn) : null;
  }, [isCheck, turn, getKingSquare]);

  // Threatened pieces detection (optional assistance)
  const threatenedSquares = useMemo(() => {
    if (!threatDetection || !chess) return new Set();
    const threats = new Set();
    const board = chess.board();
    const oppColor = turn === 'w' ? 'b' : 'w';

    // Scan opposing legal moves to see what squares are attacked
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === oppColor) {
          const sq = `${'abcdefgh'[c]}${8 - r}`;
          try {
            const moves = chess.moves({ square: sq, verbose: true });
            for (const m of moves) {
              if (m.captured) {
                threats.add(m.to);
              }
            }
          } catch {
            // Ignore temporary parsing
          }
        }
      }
    }
    return threats;
  }, [threatDetection, chess, turn]);

  // Clear selection if turn changes or board resets
  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [turn, chess]);

  // Handle square click
  const handleSquareClick = useCallback((square) => {
    if (disabled) return;

    // If clicking on an active destination target
    if (selectedSquare) {
      const isTarget = possibleMoves.some(m => m.to === square);
      if (isTarget) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
    }

    // Otherwise selecting a new piece
    const piece = chess.get(square);
    if (piece && piece.color === turn) {
      if (selectedSquare === square) {
        // Deselect on second click
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        setSelectedSquare(square);
        const legal = getPossibleMoves(square);
        setPossibleMoves(legal);
      }
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  }, [disabled, selectedSquare, possibleMoves, chess, turn, onMove, getPossibleMoves]);

  // Drag and drop handlers
  const handleDragStart = (e, square, piece) => {
    if (disabled || piece.color !== turn) {
      e.preventDefault();
      return;
    }
    setDraggingSquare(square);
    setSelectedSquare(square);
    const legal = getPossibleMoves(square);
    setPossibleMoves(legal);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const fromSquare = e.dataTransfer.getData('text/plain') || draggingSquare;
    setDraggingSquare(null);

    if (fromSquare && fromSquare !== targetSquare) {
      const isLegal = possibleMoves.some(m => m.to === targetSquare);
      if (isLegal) {
        onMove(fromSquare, targetSquare);
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
  };

  // Determine custom square style if custom colors are set
  const getSquareStyle = (isLight) => {
    if (isLight && customLightColor) return { backgroundColor: customLightColor };
    if (!isLight && customDarkColor) return { backgroundColor: customDarkColor };
    return {};
  };

  return (
    <div className={`chess-perspective-container select-none ${theme ? `theme-${theme}` : 'theme-wood'}`}>
      <div className={`chess-board-3d ${is3d ? 'tilted' : 'flat'} transition-all duration-500`}>
        {/* Outer Wooden/Themed Beveled Border */}
        <div className="board-outer-frame p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300">
          <div className="relative border-2 border-black/40 rounded-lg overflow-hidden shadow-inner">
            {/* 8x8 Board Grid */}
            <div className="grid grid-cols-8 grid-rows-8 w-[min(88vw,480px)] h-[min(88vw,480px)] sm:w-[540px] sm:h-[540px] md:w-[600px] md:h-[600px] lg:w-[640px] lg:h-[640px]">
              {ranks.map((rank, rankIdx) =>
                files.map((file, fileIdx) => {
                  const square = `${file}${rank}`;
                  const isLight = (fileIdx + rankIdx) % 2 === 0;
                  const piece = chess.get(square);

                  const isSelected = selectedSquare === square;
                  const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
                  const isChecked = checkedKingSquare === square;
                  const isThreatened = threatenedSquares.has(square) && piece && piece.color === turn;

                  // Check if this square is a possible move destination
                  const moveOption = possibleMoves.find(m => m.to === square);

                  return (
                    <div
                      key={square}
                      onClick={() => handleSquareClick(square)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, square)}
                      style={getSquareStyle(isLight)}
                      className={`
                        relative flex items-center justify-center cursor-pointer transition-colors duration-150
                        ${isLight ? 'bg-[var(--sq-light)]' : 'bg-[var(--sq-dark)]'}
                        ${isSelected ? '!bg-amber-400/60 ring-2 ring-inset ring-amber-300' : ''}
                        ${isLastMoveSquare && !isSelected ? '!bg-yellow-400/40 ring-1 ring-inset ring-yellow-400/50' : ''}
                        ${isChecked ? 'king-in-check z-10' : ''}
                      `}
                    >
                      {/* Rank coordinate indicator (leftmost edge) */}
                      {fileIdx === 0 && (
                        <span
                          className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-bold pointer-events-none ${
                            isLight ? 'text-[var(--sq-light-text)]' : 'text-[var(--sq-dark-text)]'
                          }`}
                        >
                          {rank}
                        </span>
                      )}

                      {/* File coordinate indicator (bottom edge) */}
                      {rankIdx === 7 && (
                        <span
                          className={`absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold pointer-events-none ${
                            isLight ? 'text-[var(--sq-light-text)]' : 'text-[var(--sq-dark-text)]'
                          }`}
                        >
                          {file}
                        </span>
                      )}

                      {/* Piece Icon */}
                      {piece && (
                        <div
                          draggable={!disabled && piece.color === turn}
                          onDragStart={(e) => handleDragStart(e, square, piece)}
                          className={`w-[85%] h-[85%] flex items-center justify-center chess-piece ${
                            draggingSquare === square ? 'dragging' : ''
                          }`}
                        >
                          <ChessPiece piece={piece} />
                        </div>
                      )}

                      {/* Legal Move Indicators */}
                      {moveOption && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          {moveOption.isCapture || piece ? (
                            // Capture target: outer subtle ring
                            <div className="w-full h-full border-4 sm:border-[5px] border-black/30 rounded-none animate-pulse" />
                          ) : (
                            // Non-capture move: clean translucent center dot
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black/25 shadow-sm" />
                          )}
                        </div>
                      )}

                      {/* Threat detection warning dot */}
                      {isThreatened && !moveOption && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping pointer-events-none" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
