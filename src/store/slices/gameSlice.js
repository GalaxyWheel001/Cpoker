import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const makeAction = createAsyncThunk(
  'game/makeAction',
  async ({ action, amount }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/game/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount }),
      });
      if (!response.ok) throw new Error('Failed to make action');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentGame: null,
  players: [],
  currentPlayer: null,
  pot: 0,
  communityCards: [],
  playerCards: [],
  gamePhase: 'waiting', // waiting, preflop, flop, turn, river, showdown
  lastAction: null,
  isLoading: false,
  error: null,
  gameHistory: [],
  chat: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    updateGameState: (state, action) => {
      const { pot, communityCards, gamePhase, players } = action.payload;
      if (pot !== undefined) state.pot = pot;
      if (communityCards !== undefined) state.communityCards = communityCards;
      if (gamePhase !== undefined) state.gamePhase = gamePhase;
      if (players !== undefined) state.players = players;
    },
    setPlayerCards: (state, action) => {
      state.playerCards = action.payload;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chat.push(action.payload);
    },
    addGameHistory: (state, action) => {
      state.gameHistory.push(action.payload);
    },
    clearGame: (state) => {
      state.currentGame = null;
      state.players = [];
      state.currentPlayer = null;
      state.pot = 0;
      state.communityCards = [];
      state.playerCards = [];
      state.gamePhase = 'waiting';
      state.lastAction = null;
      state.chat = [];
    },
    clearGameError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastAction = action.payload;
        // Обновляем состояние игры на основе ответа сервера
        if (action.payload.gameState) {
          state.pot = action.payload.gameState.pot;
          state.communityCards = action.payload.gameState.communityCards;
          state.gamePhase = action.payload.gameState.gamePhase;
          state.players = action.payload.gameState.players;
        }
      })
      .addCase(makeAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentGame,
  updateGameState,
  setPlayerCards,
  setCurrentPlayer,
  addChatMessage,
  addGameHistory,
  clearGame,
  clearGameError,
} = gameSlice.actions;

export default gameSlice.reducer;

