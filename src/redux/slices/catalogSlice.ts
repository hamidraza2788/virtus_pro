import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchInitialCatalog, 
  fetchNextCatalogPage, 
  refreshCatalog,
  CatalogItem,
  CatalogResponse 
} from '../../api/catalogApis';

// Custom logger for Redux
const logRedux = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[CATALOG REDUX] ${message}`, data || '');
  }
};

// Initial state
interface CatalogState {
  items: CatalogItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentOffset: number;
  totalItems: number;
  hasMoreItems: boolean;
}

const initialState: CatalogState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  currentOffset: 0,
  totalItems: 0,
  hasMoreItems: false,
};

// Async thunks
export const loadInitialCatalog = createAsyncThunk(
  'catalog/loadInitial',
  async (_, { rejectWithValue }) => {
    try {
      logRedux('Loading initial catalog');
      const response = await fetchInitialCatalog();
      logRedux('Initial catalog loaded successfully', {
        itemsCount: response.categories.length,
        total: response.total,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading initial catalog', error.message);
      return rejectWithValue(error.message || 'Failed to load catalog');
    }
  }
);

export const loadMoreCatalog = createAsyncThunk(
  'catalog/loadMore',
  async (currentOffset: number, { rejectWithValue }) => {
    try {
      logRedux('Loading more catalog items', { currentOffset });
      const response = await fetchNextCatalogPage(currentOffset);
      logRedux('More catalog items loaded successfully', {
        newItemsCount: response.categories.length,
        newOffset: response.offset,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading more catalog items', error.message);
      return rejectWithValue(error.message || 'Failed to load more items');
    }
  }
);

export const refreshCatalogData = createAsyncThunk(
  'catalog/refresh',
  async (_, { rejectWithValue }) => {
    try {
      logRedux('Refreshing catalog data');
      const response = await refreshCatalog();
      logRedux('Catalog data refreshed successfully', {
        itemsCount: response.categories.length,
        total: response.total,
      });
      return response;
    } catch (error: any) {
      logRedux('Error refreshing catalog data', error.message);
      return rejectWithValue(error.message || 'Failed to refresh catalog');
    }
  }
);

// Slice
const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    clearCatalog: (state) => {
      logRedux('Clearing catalog state');
      state.items = [];
      state.currentOffset = 0;
      state.totalItems = 0;
      state.hasMoreItems = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load Initial Catalog
    builder
      .addCase(loadInitialCatalog.pending, (state) => {
        logRedux('Loading initial catalog - pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadInitialCatalog.fulfilled, (state, action) => {
        logRedux('Loading initial catalog - fulfilled', {
          itemsCount: action.payload.categories.length,
          total: action.payload.total,
        });
        state.isLoading = false;
        state.items = action.payload.categories;
        state.currentOffset = action.payload.offset + action.payload.categories.length;
        state.totalItems = action.payload.total;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.error = null;
      })
      .addCase(loadInitialCatalog.rejected, (state, action) => {
        logRedux('Loading initial catalog - rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load More Catalog
    builder
      .addCase(loadMoreCatalog.pending, (state) => {
        logRedux('Loading more catalog - pending');
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreCatalog.fulfilled, (state, action) => {
        logRedux('Loading more catalog - fulfilled', {
          newItemsCount: action.payload.categories.length,
          totalItems: state.items.length + action.payload.categories.length,
        });
        state.isLoadingMore = false;
        state.items = [...state.items, ...action.payload.categories];
        state.currentOffset = action.payload.offset + action.payload.categories.length;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.error = null;
      })
      .addCase(loadMoreCatalog.rejected, (state, action) => {
        logRedux('Loading more catalog - rejected', action.payload);
        state.isLoadingMore = false;
        state.error = action.payload as string;
      });

    // Refresh Catalog
    builder
      .addCase(refreshCatalogData.pending, (state) => {
        logRedux('Refreshing catalog - pending');
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshCatalogData.fulfilled, (state, action) => {
        logRedux('Refreshing catalog - fulfilled', {
          itemsCount: action.payload.categories.length,
          total: action.payload.total,
        });
        state.isRefreshing = false;
        state.items = action.payload.categories;
        state.currentOffset = action.payload.offset + action.payload.categories.length;
        state.totalItems = action.payload.total;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.error = null;
      })
      .addCase(refreshCatalogData.rejected, (state, action) => {
        logRedux('Refreshing catalog - rejected', action.payload);
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCatalog, clearError } = catalogSlice.actions;
export default catalogSlice.reducer;
