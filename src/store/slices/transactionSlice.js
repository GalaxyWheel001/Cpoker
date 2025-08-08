import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });
      
      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDeposit = createAsyncThunk(
  'transaction/createDeposit',
  async (depositData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depositData),
      });
      if (!response.ok) throw new Error('Failed to create deposit');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWithdrawal = createAsyncThunk(
  'transaction/createWithdrawal',
  async (withdrawalData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/transactions/withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawalData),
      });
      if (!response.ok) throw new Error('Failed to create withdrawal');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    type: [],
    status: [],
    dateRange: null,
    amountRange: null,
  },
  summary: {
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalWinnings: 0,
    totalLosses: 0,
  },
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: [],
        status: [],
        dateRange: null,
        amountRange: null,
      };
    },
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createDeposit.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.summary.totalDeposits += action.payload.amount;
      })
      .addCase(createDeposit.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createWithdrawal.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.summary.totalWithdrawals += action.payload.amount;
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentTransaction,
  setFilters,
  clearFilters,
  clearTransactionError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
