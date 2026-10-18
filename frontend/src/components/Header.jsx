import React from 'react';
import { Crown, Bot, Users, Globe, Trophy, Settings, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export function Header({
  gameMode = 'ai',
  onSelectGameMode,
  timeControl = '10+0',
  onChangeTimeControl,
  onOpenStats,
  onOpenSettings,
  onOpenMultiplayer,
  soundEnabled = true,
  onToggleSound,
  isFullscreen = false,
  onToggleFullscreen,
}) {
  const modes = [
    { id: 'ai', label: 'vs Computer', icon: Bot },
    { id: 'local', label: 'Pass & Play', icon: Users },
    { id: 'multiplayer', label: 'Play Online', icon: Globe },
  ];

  const timeOptions = ['1+0', '3+0', '5+0', '10+0', 'unlimited'];

  return (
    <header className="glass-panel border-b border-white/10 px-4 py-2.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20">
            <Crown className="w-5 h-5 fill-neutral-950" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif font-black tracking-wider text-base text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              GRANDMASTER
            </h1>
            <p className="text-[9px] tracking-widest text-neutral-400 uppercase -mt-0.5">Classic Chess 3D</p>
          </div>
        </div>

        {/* Game Mode Selector (Pills) */}
        <div className="flex items-center bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = gameMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === 'multiplayer') {
                    onOpenMultiplayer();
                  } else {
                    onSelectGameMode(m.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Time Selector */}
          <select
            value={timeControl}
            onChange={(e) => onChangeTimeControl(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-lg px-2 py-1.5 font-mono outline-none cursor-pointer hidden lg:block"
          >
            {timeOptions.map((tc) => (
              <option key={tc} value={tc}>
                {tc === 'unlimited' ? '∞ Unlimited' : `⏱ ${tc}`}
              </option>
            ))}
          </select>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 rounded-lg glass-button text-neutral-300 hover:text-white"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            title="Career Stats & ELO"
            className="p-2 rounded-lg glass-button text-neutral-300 hover:text-amber-300"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-lg glass-button text-neutral-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-lg glass-button text-neutral-300 hover:text-white hidden sm:flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
