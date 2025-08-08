import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTables = createAsyncThunk(
  'table/fetchTables',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tables');
      if (!response.ok) throw new Error('Failed to fetch tables');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTable = createAsyncThunk(
  'table/createTable',
  async (tableData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData),
      });
      if (!response.ok) throw new Error('Failed to create table');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinTable = createAsyncThunk(
  'table/joinTable',
  async ({ tableId, buyIn }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tables/${tableId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyIn }),
      });
      if (!response.ok) throw new Error('Failed to join table');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tables: [],
  currentTable: null,
  isLoading: false,
  error: null,
  filters: {
    currency: [],
    gameType: [],
    status: [],
    buyIn: [],
  },
  searchQuery: '',
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setCurrentTable: (state, action) => {
      state.currentTable = action.payload;
    },
    updateTable: (state, action) => {
      const { tableId, updates } = action.payload;
      const tableIndex = state.tables.findIndex(table => table.id === tableId);
      if (tableIndex !== -1) {
        state.tables[tableIndex] = { ...state.tables[tableIndex], ...updates };
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearTableError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.tables.unshift(action.payload);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(joinTable.fulfilled, (state, action) => {
        state.currentTable = action.payload;
      })
      .addCase(joinTable.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentTable, 
  updateTable, 
  setFilters, 
  setSearchQuery, 
  clearTableError 
} = tableSlice.actions;

export default tableSlice.reducer;


