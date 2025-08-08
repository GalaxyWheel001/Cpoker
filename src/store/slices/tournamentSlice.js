import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTournaments = createAsyncThunk(
  'tournament/fetchTournaments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tournaments');
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTournament = createAsyncThunk(
  'tournament/createTournament',
  async (tournamentData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tournamentData),
      });
      if (!response.ok) throw new Error('Failed to create tournament');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinTournament = createAsyncThunk(
  'tournament/joinTournament',
  async ({ tournamentId, buyIn }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyIn }),
      });
      if (!response.ok) throw new Error('Failed to join tournament');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTournamentLeaderboard = createAsyncThunk(
  'tournament/getLeaderboard',
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tournaments: [],
  currentTournament: null,
  leaderboard: [],
  isLoading: false,
  error: null,
  filters: {
    status: [], // upcoming, active, completed
    type: [], // sit-n-go, scheduled, satellite
    buyIn: [],
    players: [],
  },
  userTournaments: {
    upcoming: [],
    active: [],
    completed: [],
  },
  tournamentStats: {
    totalPlayed: 0,
    totalWon: 0,
    bestFinish: null,
    averageFinish: 0,
  },
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setCurrentTournament: (state, action) => {
      state.currentTournament = action.payload;
    },
    updateTournament: (state, action) => {
      const { tournamentId, updates } = action.payload;
      const tournamentIndex = state.tournaments.findIndex(t => t.id === tournamentId);
      if (tournamentIndex !== -1) {
        state.tournaments[tournamentIndex] = { ...state.tournaments[tournamentIndex], ...updates };
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTournamentError: (state) => {
      state.error = null;
    },
    updateTournamentProgress: (state, action) => {
      const { tournamentId, progress } = action.payload;
      if (state.currentTournament?.id === tournamentId) {
        state.currentTournament = { ...state.currentTournament, ...progress };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournaments = action.payload.tournaments;
        state.userTournaments = action.payload.userTournaments;
        state.tournamentStats = action.payload.stats;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.tournaments.unshift(action.payload);
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(joinTournament.fulfilled, (state, action) => {
        state.currentTournament = action.payload;
      })
      .addCase(joinTournament.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getTournamentLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(getTournamentLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentTournament,
  updateTournament,
  setFilters,
  clearTournamentError,
  updateTournamentProgress,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
