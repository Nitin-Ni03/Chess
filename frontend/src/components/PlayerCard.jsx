import React from 'react';
import { ChessPiece } from './ChessPieces';
import { formatTime } from '../utils/chessHelpers';
import { User, Cpu, Wifi, WifiOff } from 'lucide-react';

export function PlayerCard({
  name = 'Player',
  rating = 1200,
  color = 'w',
  isCurrentTurn = false,
  isAI = false,
  aiLevel = '',
  capturedPieces = [],
  advantage = 0,
  time = null,
  isOnline = false,
  isConnected = true,
  isWhite = true,
}) {
  const isTimeCritical = time !== null && time <= 30 && time > 0;
  const isTimeOut = time === 0;

  return (
    <div
      className={`glass-panel px-4 py-3 rounded-xl flex items-center justify-between gap-3 transition-all duration-300 ${
        isCurrentTurn ? 'ring-2 ring-amber-500/80 shadow-lg shadow-amber-500/10' : 'opacity-90'
      }`}
    >
      {/* Player Identity & Captured Pieces */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-md ${
            isAI
              ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white'
              : isWhite
              ? 'bg-gradient-to-tr from-amber-200 to-amber-400 text-neutral-900 border border-amber-100/50'
              : 'bg-gradient-to-tr from-neutral-800 to-neutral-950 text-neutral-200 border border-neutral-700'
          }`}
        >
          {isAI ? <Cpu className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>

        {/* Name, rating & captured rack */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate text-neutral-100">{name}</span>
            {aiLevel && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                {aiLevel}
              </span>
            )}
            {rating && !isAI && (
              <span className="text-xs text-neutral-400 font-mono">({rating})</span>
            )}
            {isOnline && (
              <span title={isConnected ? 'Connected' : 'Disconnected'}>
                {isConnected ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                )}
              </span>
            )}
          </div>

          {/* Captured Pieces list */}
          <div className="flex items-center gap-1 mt-1 flex-wrap min-h-[18px]">
            {capturedPieces.map((pieceType, idx) => (
              <div key={idx} className="w-4 h-4 flex-shrink-0 -mr-1">
                <ChessPiece piece={{ type: pieceType, color: color === 'w' ? 'b' : 'w' }} />
              </div>
            ))}
            {advantage > 0 && (
              <span className="text-[11px] font-bold text-amber-400 ml-1.5 font-mono">
                +{advantage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Clock display */}
      {time !== null && (
        <div
          className={`px-3 py-1.5 rounded-lg font-mono font-bold text-base sm:text-lg tracking-wider border transition-colors ${
            isTimeOut
              ? 'bg-red-950/80 text-red-400 border-red-600 animate-pulse'
              : isTimeCritical
              ? 'bg-amber-950/70 text-amber-400 border-amber-600 animate-pulse'
              : isCurrentTurn
              ? 'bg-neutral-800 text-white border-amber-500/50'
              : 'bg-neutral-900/60 text-neutral-400 border-neutral-800'
          }`}
        >
          {formatTime(time)}
        </div>
      )}
    </div>
  );
}
