import { store } from '../store';
import { updateGameState, addChatMessage, setCurrentPlayer } from '../store/slices/gameSlice';
import { updateTable } from '../store/slices/tableSlice';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnecting = false;
  }

  connect(token) {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    try {
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        
        if (event.code !== 1000) { // Не нормальное закрытие
          this.reconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) {
        this.connect(token);
      }
    }, delay);
  }

  handleMessage(data) {
    switch (data.type) {
      case 'GAME_STATE_UPDATE':
        store.dispatch(updateGameState(data.payload));
        break;
      
      case 'PLAYER_TURN':
        store.dispatch(setCurrentPlayer(data.payload.playerId));
        break;
      
      case 'CHAT_MESSAGE':
        store.dispatch(addChatMessage(data.payload));
        break;
      
      case 'TABLE_UPDATE':
        store.dispatch(updateTable({
          tableId: data.payload.tableId,
          updates: data.payload.updates
        }));
        break;
      
      case 'PLAYER_JOINED':
      case 'PLAYER_LEFT':
        // Обновляем состояние стола
        if (data.payload.tableId) {
          store.dispatch(updateTable({
            tableId: data.payload.tableId,
            updates: { players: data.payload.players }
          }));
        }
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  sendMessage(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinTable(tableId) {
    this.sendMessage('JOIN_TABLE', { tableId });
  }

  leaveTable(tableId) {
    this.sendMessage('LEAVE_TABLE', { tableId });
  }

  makeAction(action, amount = null) {
    this.sendMessage('GAME_ACTION', { action, amount });
  }

  sendChatMessage(message) {
    this.sendMessage('CHAT_MESSAGE', { message });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
  }
}

export default new WebSocketService();
