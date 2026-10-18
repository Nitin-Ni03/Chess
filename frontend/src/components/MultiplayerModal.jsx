import React, { useState } from 'react';
import { Copy, Check, Users, Eye, Sparkles, X, ShieldAlert } from 'lucide-react';

export function MultiplayerModal({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  currentRoomCode,
  role,
  isConnected,
  inviteLink,
}) {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(currentRoomCode ? 'active' : 'create');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (currentRoomCode) {
      navigator.clipboard.writeText(currentRoomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinSubmit = (asSpectator = false) => {
    if (!inputCode.trim()) return;
    onJoinRoom(inputCode.trim().toUpperCase(), asSpectator ? 'spectator' : 'b');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 font-bold shadow-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">Online Multiplayer</h2>
            <p className="text-xs text-neutral-400">Play chess with friends in real time</p>
          </div>
        </div>

        {/* Active Room View */}
        {currentRoomCode ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-center">
              <span className="text-xs uppercase tracking-wider text-neutral-400">Room Code</span>
              <div className="text-3xl font-mono font-bold tracking-widest text-amber-400 my-1 select-all">
                {currentRoomCode}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs text-neutral-300">
                  {isConnected ? 'Opponent connected & ready' : 'Waiting for opponent to connect...'}
                </span>
              </div>
            </div>

            {/* Invite Link & Copy */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-medium">Friend Invite Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleCopyCode}
                className="flex-1 glass-button py-2 rounded-lg text-xs font-medium text-neutral-300 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold py-2 rounded-lg text-xs transition-colors"
              >
                Return to Game
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex border-b border-neutral-800 mb-5">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === 'create'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Create Room
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === 'join'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Join with Code
              </button>
            </div>

            {/* Create Tab */}
            {activeTab === 'create' && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Start a private chess room. You will play as <strong className="text-amber-300">White</strong>. You'll receive a unique room code and shareable invite link for your friend.
                </p>
                <button
                  onClick={onCreateRoom}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Private Room
                </button>
              </div>
            )}

            {/* Join Tab */}
            {activeTab === 'join' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Enter 6-Digit Room Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GM94X2"
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center font-mono text-xl tracking-widest text-amber-300 uppercase outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleJoinSubmit(false)}
                    disabled={inputCode.length < 3}
                    className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Users className="w-4 h-4" />
                    Play as Black
                  </button>
                  <button
                    onClick={() => handleJoinSubmit(true)}
                    disabled={inputCode.length < 3}
                    className="py-2.5 rounded-xl glass-button disabled:opacity-50 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Join Spectator
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
