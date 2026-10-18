// LocalStorage persistence utility for Grandmaster Chess

const STORAGE_KEYS = {
  SETTINGS: 'gm_chess_settings',
  STATS: 'gm_chess_stats',
  MATCH_HISTORY: 'gm_chess_match_history',
};

export const DEFAULT_SETTINGS = {
  theme: 'wood', // 'wood' | 'marble' | 'gold' | 'darkmodern' | 'cyberpunk' | 'neon'
  is3d: true,
  soundEnabled: true,
  soundVolume: 0.8,
  animationEnabled: true,
  highlightMoves: true,
  threatDetection: true,
  autoQueen: false,
  boardFlip: false,
  customLightColor: '',
  customDarkColor: '',
  difficulty: 'medium', // 'easy' | 'medium' | 'hard'
  timeControl: '10+0', // '1+0' (Bullet), '3+0' (Blitz), '5+0' (Blitz), '10+0' (Rapid), 'unlimited'
  pieceSet: 'staunton',
};

export const DEFAULT_STATS = {
  elo: 1200,
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0,
  winStreak: 0,
  bestStreak: 0,
};

export const storage = {
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  },

  getStats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  },

  saveStats(stats) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats to localStorage:', e);
    }
  },

  getMatchHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MATCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addMatchRecord(record) {
    try {
      const history = this.getMatchHistory();
      const updated = [record, ...history].slice(0, 50); // keep last 50 matches
      localStorage.setItem(STORAGE_KEYS.MATCH_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save match history:', e);
    }
  },

  updateStatsOnGameEnd(result, opponentType = 'ai') {
    // result: 'win' | 'loss' | 'draw'
    const stats = this.getStats();
    stats.totalGames += 1;

    let eloDelta = 0;
    if (result === 'win') {
      stats.wins += 1;
      stats.winStreak += 1;
      if (stats.winStreak > stats.bestStreak) {
        stats.bestStreak = stats.winStreak;
      }
      eloDelta = opponentType === 'ai-hard' ? 24 : opponentType === 'ai-medium' ? 16 : 10;
    } else if (result === 'loss') {
      stats.losses += 1;
      stats.winStreak = 0;
      eloDelta = -12;
    } else {
      stats.draws += 1;
      stats.winStreak = 0;
      eloDelta = 2;
    }

    stats.elo = Math.max(400, stats.elo + eloDelta);
    this.saveStats(stats);
    return { stats, eloDelta };
  },

  resetStats() {
    this.saveStats(DEFAULT_STATS);
    try {
      localStorage.removeItem(STORAGE_KEYS.MATCH_HISTORY);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STATS;
  }
};
