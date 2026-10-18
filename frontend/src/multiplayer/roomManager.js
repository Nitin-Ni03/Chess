// Real-Time Room Manager supporting cross-tab BroadcastChannel and storage-event peer sync

class RoomManager {
  constructor() {
    this.roomCode = null;
    this.role = null; // 'w' | 'b' | 'spectator'
    this.channel = null;
    this.listeners = new Set();
    this.isOpponentConnected = false;
    this.heartbeatInterval = null;
    this.lastPeerPing = 0;
  }

  // Generate 6-char alphanumeric room code
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Create room as host (White)
  createRoom() {
    const code = this.generateRoomCode();
    this.joinRoom(code, 'w');
    return code;
  }

  // Join existing room
  joinRoom(code, role = 'b') {
    this.leaveRoom();
    this.roomCode = code.toUpperCase();
    this.role = role;

    // Use standard BroadcastChannel for instant real-time synchronization
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(`chess_room_${this.roomCode}`);
      this.channel.onmessage = (event) => {
        this.handleIncomingMessage(event.data);
      };
    }

    // Also listen to storage events for cross-window fallback
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent);
    }

    // Start heartbeat
    this.startHeartbeat();

    // Broadcast join announcement
    this.broadcast({
      type: 'PEER_JOIN',
      role: this.role,
      timestamp: Date.now(),
    });
  }

  leaveRoom() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.roomCode = null;
    this.role = null;
    this.isOpponentConnected = false;
  }

  // Broadcast message to peer
  broadcast(payload) {
    const message = {
      roomCode: this.roomCode,
      senderRole: this.role,
      ...payload,
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.error('Channel send error:', err);
      }
    }

    // LocalStorage fallback for broad browser support
    try {
      localStorage.setItem(`chess_sync_${this.roomCode}`, JSON.stringify({ ...message, _ts: Date.now() }));
    } catch {
      // Ignore quota errors
    }
  }

  handleIncomingMessage(data) {
    if (!data || data.roomCode !== this.roomCode) return;
    if (data.senderRole === this.role) return; // ignore echo

    if (data.type === 'PING') {
      this.lastPeerPing = Date.now();
      if (!this.isOpponentConnected) {
        this.isOpponentConnected = true;
        this.notifyListeners({ type: 'CONNECTION_CHANGE', connected: true });
      }
      return;
    }

    if (data.type === 'PEER_JOIN') {
      this.isOpponentConnected = true;
      this.notifyListeners({ type: 'CONNECTION_CHANGE', connected: true });
      // Respond with PING acknowledge
      this.broadcast({ type: 'PING' });
    }

    this.notifyListeners(data);
  }

  handleStorageEvent = (e) => {
    if (e.key === `chess_sync_${this.roomCode}` && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        this.handleIncomingMessage(data);
      } catch {
        // parse error
      }
    }
  };

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.broadcast({ type: 'PING' });

      // Check if peer timed out (no ping for 8 seconds)
      if (this.isOpponentConnected && Date.now() - this.lastPeerPing > 8000) {
        this.isOpponentConnected = false;
        this.notifyListeners({ type: 'CONNECTION_CHANGE', connected: false });
      }
    }, 3000);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  // Get shareable friend invite link
  getInviteLink(role = 'b') {
    if (!this.roomCode) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}?room=${this.roomCode}&role=${role}`;
  }
}

export const roomManager = new RoomManager();
