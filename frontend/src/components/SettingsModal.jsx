import React from 'react';
import { Settings, Volume2, VolumeX, Eye, Layers, Zap, X, RotateCcw, Palette, Clock } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
  onResetSettings,
}) {
  if (!isOpen) return null;

  const themes = [
    { id: 'wood', name: 'Classic Wood', light: '#e3c193', dark: '#8b4a24' },
    { id: 'marble', name: 'Marble', light: '#e2e8f0', dark: '#64748b' },
    { id: 'gold', name: 'Royal Gold', light: '#fae8b2', dark: '#b8860b' },
    { id: 'darkmodern', name: 'Dark Modern', light: '#32374a', dark: '#1a1c24' },
    { id: 'cyberpunk', name: 'Cyberpunk', light: '#06b6d4', dark: '#d946ef' },
    { id: 'neon', name: 'Neon Emerald', light: '#a7f3d0', dark: '#059669' },
  ];

  const difficulties = [
    { id: 'easy', label: 'Easy (Casual)', desc: 'Fast play, occasional inaccuracies' },
    { id: 'medium', label: 'Medium (Positional)', desc: 'Minimax depth 2 with piece values' },
    { id: 'hard', label: 'Hard (Grandmaster)', desc: 'Alpha-Beta pruning depth 3-4 with PST' },
  ];

  const timeControls = [
    { id: '1+0', label: '1 min (Bullet)' },
    { id: '3+0', label: '3 min (Blitz)' },
    { id: '5+0', label: '5 min (Blitz)' },
    { id: '10+0', label: '10 min (Rapid)' },
    { id: 'unlimited', label: 'Unlimited' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">Game Settings</h2>
            <p className="text-xs text-neutral-400">Customize board appearance, sounds, and difficulty</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Board Themes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Board Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSetting('theme', t.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    settings.theme === t.id
                      ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md overflow-hidden flex border border-black/30 shadow-sm flex-shrink-0">
                    <div className="w-1/2 h-full" style={{ backgroundColor: t.light }} />
                    <div className="w-1/2 h-full" style={{ backgroundColor: t.dark }} />
                  </div>
                  <span className="text-xs font-medium text-neutral-200 truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Board & Visual Effects */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Board Perspective & Visuals
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Realistic 3D Perspective Tilt</div>
                  <div className="text-[11px] text-neutral-400">Render dynamic angled depth and shadows</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.is3d}
                  onChange={(e) => onUpdateSetting('is3d', e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Threat Detection Highlights</div>
                  <div className="text-[11px] text-neutral-400">Warn about undefended or attacked pieces</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.threatDetection}
                  onChange={(e) => onUpdateSetting('threatDetection', e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* AI Difficulty */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Computer AI Difficulty
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onUpdateSetting('difficulty', d.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.difficulty === d.id
                      ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-200">{d.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Default Time Control */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Default Game Clock
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {timeControls.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => onUpdateSetting('timeControl', tc.id)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-medium transition-all ${
                    settings.timeControl === tc.id
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Audio */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-1.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              )}
              Audio & Acoustics
            </label>
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-neutral-200">Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSetting('soundEnabled', e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {settings.soundEnabled && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-neutral-400 w-16">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => onUpdateSetting('soundVolume', parseFloat(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-xs font-mono text-neutral-400 w-8 text-right">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onResetSettings}
            className="text-xs text-neutral-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
