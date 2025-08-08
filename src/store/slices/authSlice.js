import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const loginWithTelegram = createAsyncThunk(
  'auth/loginWithTelegram',
  async (telegramData, { rejectWithValue }) => {
    try {
      // Здесь будет API вызов для аутентификации через Telegram
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramData),
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPhoneNumber = createAsyncThunk(
  'auth/verifyPhone',
  async ({ phoneNumber, code }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code }),
      });
      
      if (!response.ok) {
        throw new Error('Phone verification failed');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeKYC = createAsyncThunk(
  'auth/completeKYC',
  async (kycData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(kycData).forEach(key => {
        formData.append(key, kycData[key]);
      });

      const response = await fetch('/api/auth/kyc', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('KYC verification failed');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Здесь будет API вызов для выхода
      await fetch('/api/auth/logout', { method: 'POST' });
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('token'),
  verificationStatus: {
    phoneVerified: false,
    kycCompleted: false,
    emailVerified: false,
    telegramVerified: false,
  },
  antiBotChecks: {
    captchaCompleted: false,
    deviceFingerprint: null,
    behaviorAnalysis: null,
  },
  sessionInfo: {
    lastActivity: null,
    ipAddress: null,
    userAgent: null,
    deviceId: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateVerificationStatus: (state, action) => {
      state.verificationStatus = { ...state.verificationStatus, ...action.payload };
    },
    setAntiBotChecks: (state, action) => {
      state.antiBotChecks = { ...state.antiBotChecks, ...action.payload };
    },
    updateSessionInfo: (state, action) => {
      state.sessionInfo = { ...state.sessionInfo, ...action.payload };
    },
    setDeviceFingerprint: (state, action) => {
      state.antiBotChecks.deviceFingerprint = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithTelegram.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithTelegram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.verificationStatus = action.payload.verificationStatus;
        state.sessionInfo = action.payload.sessionInfo;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginWithTelegram.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyPhoneNumber.fulfilled, (state, action) => {
        state.verificationStatus.phoneVerified = true;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(verifyPhoneNumber.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(completeKYC.fulfilled, (state, action) => {
        state.verificationStatus.kycCompleted = true;
        state.user = { ...state.user, ...action.payload.user };
      })
      .addCase(completeKYC.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.verificationStatus = {
          phoneVerified: false,
          kycCompleted: false,
          emailVerified: false,
          telegramVerified: false,
        };
        state.antiBotChecks = {
          captchaCompleted: false,
          deviceFingerprint: null,
          behaviorAnalysis: null,
        };
        localStorage.removeItem('token');
      });
  },
});

export const { 
  clearError, 
  setUser, 
  updateVerificationStatus, 
  setAntiBotChecks, 
  updateSessionInfo,
  setDeviceFingerprint 
} = authSlice.actions;
export default authSlice.reducer;
