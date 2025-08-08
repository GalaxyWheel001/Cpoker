import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import userReducer from './slices/userSlice';
import tableReducer from './slices/tableSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    user: userReducer,
    table: tableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Helpers for non-TS environments; can be replaced with TS types later if needed
export const getRootState = () => store.getState();
export const getAppDispatch = () => store.dispatch;
