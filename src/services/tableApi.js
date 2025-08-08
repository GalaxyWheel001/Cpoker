import { createWSClient } from './wsClient';

export class TableConnection {
  constructor({ tableId, token }) {
    this.tableId = tableId;
    this.token = token;
    this.client = createWSClient(tableId, token);
    this.unsubs = [];
  }

  connect({ onState, onChat, onJoin, onLeave }) {
    if (!this.client) return;
    this.unsubs.push(this.client.on('state', (data) => onState && onState(data.table)));
    this.unsubs.push(this.client.on('chat', (data) => onChat && onChat(data)));
    this.unsubs.push(this.client.on('player_joined', (d) => onJoin && onJoin(d.player)));
    this.unsubs.push(this.client.on('player_left', (d) => onLeave && onLeave(d.playerId)));
    this.client.connect({ tableId: this.tableId });
    setTimeout(() => this.client.send('hello', {}), 100);
  }

  join(player) { this.client?.send('join_table', { player }); }
  leave(playerId) { this.client?.send('leave_table', { playerId }); }
  action({ playerId, action, amount }) { this.client?.send('player_action', { playerId, action, amount }); }
  chat({ playerId, message }) { this.client?.send('chat', { playerId, message }); }

  disconnect() {
    this.unsubs.forEach(fn => fn && fn());
    this.client?.close();
  }
}
