import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAchievements = createAsyncThunk(
  'achievement/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/achievements');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'achievement/fetchLeaderboard',
  async ({ type = 'global', period = 'monthly' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leaderboard?type=${type}&period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const claimAchievement = createAsyncThunk(
  'achievement/claimAchievement',
  async (achievementId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/achievements/${achievementId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to claim achievement');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  achievements: [],
  userAchievements: [],
  leaderboard: {
    global: [],
    weekly: [],
    monthly: [],
  },
  stats: {
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalPoints: 0,
    rank: null,
    level: 1,
    experience: 0,
    nextLevelExp: 1000,
  },
  recentUnlocks: [],
  isLoading: false,
  error: null,
  filters: {
    category: [], // gameplay, social, tournament, special
    rarity: [], // common, rare, epic, legendary
    status: [], // locked, unlocked, claimed
  },
};

const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    unlockAchievement: (state, action) => {
      const achievement = action.payload;
      const existingIndex = state.userAchievements.findIndex(a => a.id === achievement.id);
      
      if (existingIndex === -1) {
        state.userAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString(),
          claimed: false,
        });
        state.recentUnlocks.unshift(achievement);
        state.stats.unlockedAchievements += 1;
        state.stats.totalPoints += achievement.points;
        
        // Ограничиваем количество недавних разблокировок
        if (state.recentUnlocks.length > 5) {
          state.recentUnlocks.pop();
        }
      }
    },
    addExperience: (state, action) => {
      const exp = action.payload;
      state.stats.experience += exp;
      
      // Проверяем повышение уровня
      while (state.stats.experience >= state.stats.nextLevelExp) {
        state.stats.experience -= state.stats.nextLevelExp;
        state.stats.level += 1;
        state.stats.nextLevelExp = Math.floor(state.stats.nextLevelExp * 1.2);
      }
    },
    updateRank: (state, action) => {
      state.stats.rank = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearRecentUnlocks: (state) => {
      state.recentUnlocks = [];
    },
    clearAchievementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload.achievements;
        state.userAchievements = action.payload.userAchievements;
        state.stats = action.payload.stats;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.leaderboard[type] = data;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(claimAchievement.fulfilled, (state, action) => {
        const { achievementId, reward } = action.payload;
        const achievementIndex = state.userAchievements.findIndex(a => a.id === achievementId);
        if (achievementIndex !== -1) {
          state.userAchievements[achievementIndex].claimed = true;
        }
      })
      .addCase(claimAchievement.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  unlockAchievement,
  addExperience,
  updateRank,
  setFilters,
  clearRecentUnlocks,
  clearAchievementError,
} = achievementSlice.actions;

export default achievementSlice.reducer;
