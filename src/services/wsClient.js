/* Lightweight WebSocket client with auto-reconnect and event subscriptions */

const DEFAULT_RECONNECT_MS = 1500;

export class WSClient {
  constructor({ url, protocols, onOpen, onClose, onError, onMessage, token }) {
    this.baseUrl = url;
    this.protocols = protocols;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.onError = onError;
    this.onMessage = onMessage;
    this.token = token;

    this.ws = null;
    this.reconnectTimer = null;
    this.isManuallyClosed = false;
    this.subscribers = new Map(); // event -> Set(callback)
    this.seq = 0;
  }

  connect(params = {}) {
    const qs = new URLSearchParams({ ...params });
    if (this.token) qs.set('token', this.token);
    const url = this.baseUrl.includes('?') ? `${this.baseUrl}&${qs}` : `${this.baseUrl}?${qs}`;

    try {
      this.ws = new WebSocket(url, this.protocols);
      this.ws.onopen = (ev) => {
        if (this.onOpen) this.onOpen(ev);
        this.emitLocal('open', ev);
      };
      this.ws.onclose = (ev) => {
        if (this.onClose) this.onClose(ev);
        this.emitLocal('close', ev);
        if (!this.isManuallyClosed) this.scheduleReconnect(params);
      };
      this.ws.onerror = (ev) => {
        if (this.onError) this.onError(ev);
        this.emitLocal('error', ev);
      };
      this.ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          this.emitLocal('message', data);
          if (data?.type) this.emitLocal(data.type, data);
          if (this.onMessage) this.onMessage(data);
        } catch {
          // ignore
        }
      };
    } catch (err) {
      this.scheduleReconnect(params);
    }
  }

  scheduleReconnect(params) {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(params), DEFAULT_RECONNECT_MS);
  }

  close() {
    this.isManuallyClosed = true;
    clearTimeout(this.reconnectTimer);
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.ws.close();
    }
  }

  send(type, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    const msg = JSON.stringify({ id: ++this.seq, type, ...payload });
    this.ws.send(msg);
    return true;
  }

  on(event, cb) {
    if (!this.subscribers.has(event)) this.subscribers.set(event, new Set());
    this.subscribers.get(event).add(cb);
    return () => this.off(event, cb);
  }

  off(event, cb) {
    if (this.subscribers.has(event)) this.subscribers.get(event).delete(cb);
  }

  emitLocal(event, data) {
    if (!this.subscribers.has(event)) return;
    for (const cb of this.subscribers.get(event)) cb(data);
  }
}

export const createWSClient = (tableId, token) => {
  const baseUrl = import.meta.env.VITE_WS_URL || '';
  if (!baseUrl) return null;
  const url = `${baseUrl.replace(/\/$/, '')}/ws`; // e.g. wss://your-worker/ws
  return new WSClient({ url, token });
};
