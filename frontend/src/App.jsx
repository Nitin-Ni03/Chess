import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { ChessBoard } from './components/ChessBoard';
import { PlayerCard } from './components/PlayerCard';
import { EvalBar } from './components/EvalBar';
import { MoveHistoryPanel } from './components/MoveHistoryPanel';
import { PromotionModal } from './components/PromotionModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { MultiplayerModal } from './components/MultiplayerModal';
import { ImportModal } from './components/ImportModal';
import { GameOverModal } from './components/GameOverModal';
import { Header } from './components/Header';
import { soundService } from './services/soundService';
import { storage } from './utils/storage';
import { exportPGNContent } from './utils/chessHelpers';
import { findBestMove, getMoveHint, getPositionEvalScore } from './ai/chessAI';
import { roomManager } from './multiplayer/roomManager';

export default function App() {
  // Settings & Local Preferences
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [stats, setStats] = useState(() => storage.getStats());
  const [matchHistory, setMatchHistory] = useState(() => storage.getMatchHistory());

  // Game Mode: 'ai' | 'local' | 'multiplayer'
  const [gameMode, setGameMode] = useState('ai');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [hintData, setHintData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [lastEloDelta, setLastEloDelta] = useState(0);

  // Multiplayer room state
  const [currentRoomCode, setCurrentRoomCode] = useState(null);
  const [myMultiplayerRole, setMyMultiplayerRole] = useState('w'); // 'w' | 'b' | 'spectator'
  const [isPeerConnected, setIsPeerConnected] = useState(false);

  // Initialize Core Game Hook
  const {
    chess,
    fen,
    turn,
    isCheck,
    gameOver,
    winner,
    winReason,
    history,
    currentStep,
    lastMove,
    pendingPromotion,
    timers,
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
  } = useChessGame(settings.timeControl);

  // Sound Engine sync
  useEffect(() => {
    soundService.setEnabled(settings.soundEnabled);
    soundService.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Handle URL room invite if user opened invite link (?room=XYZ123&role=b)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      const roleParam = params.get('role') || 'b';
      if (roomParam) {
        handleJoinRoom(roomParam, roleParam);
      }
    }
  }, []);

  // Update setting helper
  const handleUpdateSetting = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      storage.saveSettings(updated);
      return updated;
    });
    if (key === 'timeControl') {
      setTimeControl(value);
      resetGame(value);
    }
  };

  const handleResetSettings = () => {
    const def = storage.getSettings();
    setSettings(def);
    storage.saveSettings(def);
  };

  const handleResetStats = () => {
    const def = storage.resetStats();
    setStats(def);
    setMatchHistory([]);
  };

  // Flip board manually or automatically for Black
  const handleToggleFlip = () => {
    setBoardFlipped((prev) => !prev);
  };

  // Evaluation score calculation
  const evalScore = useMemo(() => {
    return getPositionEvalScore(chess);
  }, [chess, fen]);

  // Human player makes a move
  const handlePlayerMove = useCallback(
    (from, to, promo) => {
      // In online multiplayer, block moves if not your turn or if spectator
      if (gameMode === 'multiplayer') {
        if (myMultiplayerRole === 'spectator' || turn !== myMultiplayerRole) {
          return;
        }
      }

      // In AI mode, block moves if it's AI's turn
      if (gameMode === 'ai' && turn === 'b') {
        return;
      }

      const moveResult = executeMove(from, to, promo);

      // If multiplayer, broadcast move to peer
      if (moveResult && moveResult !== 'PROMOTION_REQUIRED' && gameMode === 'multiplayer') {
        roomManager.broadcast({
          type: 'MOVE',
          from,
          to,
          promotion: promo || 'q',
        });
      }

      // Clear move hint
      setHintData(null);
    },
    [gameMode, myMultiplayerRole, turn, executeMove]
  );

  // AI response move handling
  useEffect(() => {
    if (gameMode !== 'ai' || turn !== 'b' || gameOver) return;

    setIsAiThinking(true);
    const thinkDelay = settings.difficulty === 'easy' ? 400 : settings.difficulty === 'medium' ? 650 : 850;

    const timer = setTimeout(() => {
      const botMove = findBestMove(chess, settings.difficulty);
      if (botMove) {
        executeMove(botMove.from, botMove.to, botMove.promotion || 'q');
      }
      setIsAiThinking(false);
    }, thinkDelay);

    return () => clearTimeout(timer);
  }, [gameMode, turn, gameOver, chess, settings.difficulty, executeMove]);

  // Handle Game Over recording & modal trigger
  const gameOverHandledRef = useRef(false);
  useEffect(() => {
    if (gameOver && !gameOverHandledRef.current) {
      gameOverHandledRef.current = true;
      setIsGameOverModalOpen(true);

      // Record match results if in AI or Local mode
      let result = 'draw';
      if (winner === 'w') result = 'win';
      else if (winner === 'b') result = 'loss';

      const opponentType = gameMode === 'ai' ? `ai-${settings.difficulty}` : 'local';
      const opponentName = gameMode === 'ai' ? `Stockfish AI (${settings.difficulty})` : 'Local Friend';

      const { stats: newStats, eloDelta } = storage.updateStatsOnGameEnd(result, opponentType);
      setStats(newStats);
      setLastEloDelta(eloDelta);

      storage.addMatchRecord({
        date: new Date().toLocaleDateString(),
        opponent: opponentName,
        mode: settings.timeControl,
        result,
        eloDelta,
      });
      setMatchHistory(storage.getMatchHistory());
    } else if (!gameOver) {
      gameOverHandledRef.current = false;
    }
  }, [gameOver, winner, gameMode, settings.difficulty, settings.timeControl]);

  // Multiplayer Peer Events Subscription
  useEffect(() => {
    const unsubscribe = roomManager.subscribe((event) => {
      if (event.type === 'MOVE') {
        executeMove(event.from, event.to, event.promotion);
      } else if (event.type === 'RESIGN') {
        resign(event.senderRole);
      } else if (event.type === 'DRAW_ACCEPT') {
        agreeDraw();
      } else if (event.type === 'RESTART') {
        resetGame();
      } else if (event.type === 'CONNECTION_CHANGE') {
        setIsPeerConnected(event.connected);
      }
    });

    return () => unsubscribe();
  }, [executeMove, resign, agreeDraw, resetGame]);

  // Multiplayer Room Handlers
  const handleCreateRoom = () => {
    const code = roomManager.createRoom();
    setCurrentRoomCode(code);
    setMyMultiplayerRole('w');
    setGameMode('multiplayer');
    setBoardFlipped(false);
    resetGame();
  };

  const handleJoinRoom = (code, role = 'b') => {
    roomManager.joinRoom(code, role);
    setCurrentRoomCode(code);
    setMyMultiplayerRole(role);
    setGameMode('multiplayer');
    setBoardFlipped(role === 'b');
    resetGame();
    setIsMultiplayerOpen(false);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        undoMove();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        redoMove();
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFlip();
      } else if (e.key === 'h' || e.key === 'H') {
        handleGetHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoMove, redoMove]);

  // Hint Generator
  const handleGetHint = () => {
    if (gameOver) return;
    const hint = getMoveHint(chess);
    setHintData(hint);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Export current PGN string
  const handleGetPGN = () => {
    return exportPGNContent(chess, {
      white: 'White',
      black: gameMode === 'ai' ? `Computer (${settings.difficulty})` : 'Black',
      result: winner === 'w' ? '1-0' : winner === 'b' ? '0-1' : winner === 'draw' ? '1/2-1/2' : '*',
      timeControl: settings.timeControl,
    });
  };

  // Names & labels for player cards
  const topPlayerInfo = useMemo(() => {
    if (boardFlipped) {
      return {
        name: 'You (White)',
        rating: stats.elo,
        color: 'w',
        isWhite: true,
        isAI: false,
        time: timers.w,
        captured: captured.b,
        advantage: advantage.w,
      };
    }
    return {
      name: gameMode === 'ai' ? 'Stockfish AI' : gameMode === 'multiplayer' ? 'Online Opponent' : 'Player 2 (Black)',
      rating: gameMode === 'ai' ? (settings.difficulty === 'hard' ? 2400 : settings.difficulty === 'medium' ? 1600 : 900) : 1200,
      color: 'b',
      isWhite: false,
      isAI: gameMode === 'ai',
      aiLevel: gameMode === 'ai' ? settings.difficulty.toUpperCase() : '',
      time: timers.b,
      captured: captured.w,
      advantage: advantage.b,
      isOnline: gameMode === 'multiplayer',
      isConnected: isPeerConnected,
    };
  }, [boardFlipped, stats.elo, gameMode, settings.difficulty, timers, captured, advantage, isPeerConnected]);

  const bottomPlayerInfo = useMemo(() => {
    if (boardFlipped) {
      return {
        name: gameMode === 'ai' ? 'Stockfish AI' : 'Player 2 (Black)',
        rating: 1200,
        color: 'b',
        isWhite: false,
        isAI: gameMode === 'ai',
        aiLevel: gameMode === 'ai' ? settings.difficulty.toUpperCase() : '',
        time: timers.b,
        captured: captured.w,
        advantage: advantage.b,
      };
    }
    return {
      name: 'You (White)',
      rating: stats.elo,
      color: 'w',
      isWhite: true,
      isAI: false,
      time: timers.w,
      captured: captured.b,
      advantage: advantage.w,
      isOnline: gameMode === 'multiplayer',
      isConnected: isPeerConnected,
    };
  }, [boardFlipped, stats.elo, gameMode, settings.difficulty, timers, captured, advantage, isPeerConnected]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d13] text-neutral-100">
      {/* Top Header */}
      <Header
        gameMode={gameMode}
        onSelectGameMode={(m) => {
          setGameMode(m);
          setBoardFlipped(false);
          resetGame();
        }}
        timeControl={settings.timeControl}
        onChangeTimeControl={(tc) => handleUpdateSetting('timeControl', tc)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMultiplayer={() => setIsMultiplayerOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => handleUpdateSetting('soundEnabled', !settings.soundEnabled)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Play Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* Left: Live Evaluation Bar (visible on md+) */}
        <div className="hidden md:flex flex-col items-center">
          <EvalBar score={evalScore} isFlipped={boardFlipped} />
        </div>

        {/* Center: Top Player Card + 3D Chess Board + Bottom Player Card */}
        <div className="flex flex-col items-center gap-3 w-full max-w-[640px]">
          {/* Top Player Card (Opponent) */}
          <div className="w-full">
            <PlayerCard
              name={topPlayerInfo.name}
              rating={topPlayerInfo.rating}
              color={topPlayerInfo.color}
              isWhite={topPlayerInfo.isWhite}
              isCurrentTurn={turn === topPlayerInfo.color}
              isAI={topPlayerInfo.isAI}
              aiLevel={topPlayerInfo.aiLevel}
              time={topPlayerInfo.time}
              capturedPieces={topPlayerInfo.captured}
              advantage={topPlayerInfo.advantage}
              isOnline={topPlayerInfo.isOnline}
              isConnected={topPlayerInfo.isConnected}
            />
          </div>

          {/* Interactive 3D Chess Board */}
          <div className="relative">
            <ChessBoard
              chess={chess}
              turn={turn}
              is3d={settings.is3d}
              theme={settings.theme}
              flipped={boardFlipped}
              lastMove={lastMove}
              isCheck={isCheck}
              getKingSquare={getKingSquare}
              getPossibleMoves={getPossibleMoves}
              onMove={handlePlayerMove}
              threatDetection={settings.threatDetection}
              customLightColor={settings.customLightColor}
              customDarkColor={settings.customDarkColor}
              disabled={isAiThinking || (gameMode === 'multiplayer' && myMultiplayerRole === 'spectator')}
            />

            {/* AI Thinking Floating Indicator */}
            {isAiThinking && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-purple-500/50 shadow-xl backdrop-blur-md flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-xs font-semibold text-purple-200 font-mono">
                  AI is calculating best move...
                </span>
              </div>
            )}

            {/* Check Danger Alert */}
            {isCheck && !gameOver && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-red-950/90 border border-red-500/60 shadow-xl backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-300 font-serif tracking-wide">
                  CHECK!
                </span>
              </div>
            )}
          </div>

          {/* Bottom Player Card (User) */}
          <div className="w-full">
            <PlayerCard
              name={bottomPlayerInfo.name}
              rating={bottomPlayerInfo.rating}
              color={bottomPlayerInfo.color}
              isWhite={bottomPlayerInfo.isWhite}
              isCurrentTurn={turn === bottomPlayerInfo.color}
              isAI={bottomPlayerInfo.isAI}
              aiLevel={bottomPlayerInfo.aiLevel}
              time={bottomPlayerInfo.time}
              capturedPieces={bottomPlayerInfo.captured}
              advantage={bottomPlayerInfo.advantage}
              isOnline={bottomPlayerInfo.isOnline}
              isConnected={bottomPlayerInfo.isConnected}
            />
          </div>
        </div>

        {/* Right: Move History Panel, Analysis Tools & Actions */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <MoveHistoryPanel
            history={history}
            currentStep={currentStep}
            onJumpToMove={jumpToMove}
            onUndo={undoMove}
            onRedo={redoMove}
            onGetHint={handleGetHint}
            hintData={hintData}
            onResetGame={() => resetGame()}
            onResign={(c) => resign(c)}
            onOfferDraw={agreeDraw}
            onFlipBoard={handleToggleFlip}
            onOpenImportModal={() => setIsImportOpen(true)}
            getPGN={handleGetPGN}
            fen={fen}
            gameOver={gameOver}
            turn={turn}
          />
        </div>
      </main>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={turn}
          onSelect={confirmPromotion}
          onCancel={cancelPromotion}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSetting={handleUpdateSetting}
        onResetSettings={handleResetSettings}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        matchHistory={matchHistory}
        onResetStats={handleResetStats}
      />

      {/* Multiplayer Room Modal */}
      <MultiplayerModal
        isOpen={isMultiplayerOpen}
        onClose={() => setIsMultiplayerOpen(false)}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        currentRoomCode={currentRoomCode}
        role={myMultiplayerRole}
        isConnected={isPeerConnected}
        inviteLink={roomManager.getInviteLink('b')}
      />

      {/* Import PGN / FEN Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onLoadFEN={loadFEN}
        onLoadPGN={loadPGN}
      />

      {/* Game Over Celebration Modal */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        winner={winner}
        winReason={winReason}
        playerColor={boardFlipped ? 'b' : 'w'}
        eloDelta={lastEloDelta}
        onRematch={() => {
          setIsGameOverModalOpen(false);
          resetGame();
        }}
        onNewGame={() => {
          setIsGameOverModalOpen(false);
          resetGame();
        }}
        onClose={() => setIsGameOverModalOpen(false)}
      />
    </div>
  );
}
