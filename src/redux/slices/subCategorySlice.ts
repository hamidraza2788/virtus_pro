import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchInitialSubCategories, 
  fetchNextSubCategoriesPage, 
  refreshSubCategories,
  SubCategoryItem,
  SubCategoryResponse 
} from '../../api/catalogApis';

// Custom logger for Redux
const logRedux = (message: string, data?: any) => {
  // Logging removed for production
};

// Initial state
interface SubCategoryState {
  items: SubCategoryItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentOffset: number;
  totalItems: number;
  hasMoreItems: boolean;
  currentCategory: string | null;
}

const initialState: SubCategoryState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  currentOffset: 0,
  totalItems: 0,
  hasMoreItems: false,
  currentCategory: null,
};

// Async thunks
export const loadInitialSubCategories = createAsyncThunk(
  'subCategory/loadInitial',
  async (category: string, { rejectWithValue }) => {
    try {
      logRedux('Loading initial subcategories', { category });
      const response = await fetchInitialSubCategories(category);
      logRedux('Initial subcategories loaded successfully', {
        itemsCount: response.subcategories.length,
        total: response.total,
        category: response.category,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading initial subcategories', error.message);
      return rejectWithValue(error.message || 'Failed to load subcategories');
    }
  }
);

export const loadMoreSubCategories = createAsyncThunk(
  'subCategory/loadMore',
  async ({ category, currentOffset }: { category: string; currentOffset: number }, { rejectWithValue }) => {
    try {
      logRedux('Loading more subcategories', { category, currentOffset });
      const response = await fetchNextSubCategoriesPage(category, currentOffset);
      logRedux('More subcategories loaded successfully', {
        newItemsCount: response.subcategories.length,
        newOffset: response.offset,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading more subcategories', error.message);
      return rejectWithValue(error.message || 'Failed to load more subcategories');
    }
  }
);

export const refreshSubCategoriesData = createAsyncThunk(
  'subCategory/refresh',
  async (category: string, { rejectWithValue }) => {
    try {
      logRedux('Refreshing subcategories data', { category });
      const response = await refreshSubCategories(category);
      logRedux('Subcategories data refreshed successfully', {
        itemsCount: response.subcategories.length,
        total: response.total,
      });
      return response;
    } catch (error: any) {
      logRedux('Error refreshing subcategories data', error.message);
      return rejectWithValue(error.message || 'Failed to refresh subcategories');
    }
  }
);

// Slice
const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    clearSubCategories: (state) => {
      logRedux('Clearing subcategories state');
      state.items = [];
      state.currentOffset = 0;
      state.totalItems = 0;
      state.hasMoreItems = false;
      state.error = null;
      state.currentCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load Initial SubCategories
    builder
      .addCase(loadInitialSubCategories.pending, (state) => {
        logRedux('Loading initial subcategories - pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadInitialSubCategories.fulfilled, (state, action) => {
        logRedux('Loading initial subcategories - fulfilled', {
          itemsCount: action.payload.subcategories.length,
          total: action.payload.total,
          category: action.payload.category,
        });
        state.isLoading = false;
        state.items = action.payload.subcategories;
        state.currentOffset = action.payload.offset + action.payload.subcategories.length;
        state.totalItems = action.payload.total;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.currentCategory = action.payload.category;
        state.error = null;
      })
      .addCase(loadInitialSubCategories.rejected, (state, action) => {
        logRedux('Loading initial subcategories - rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load More SubCategories
    builder
      .addCase(loadMoreSubCategories.pending, (state) => {
        logRedux('Loading more subcategories - pending');
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreSubCategories.fulfilled, (state, action) => {
        logRedux('Loading more subcategories - fulfilled', {
          newItemsCount: action.payload.subcategories.length,
          totalItems: state.items.length + action.payload.subcategories.length,
        });
        state.isLoadingMore = false;
        state.items = [...state.items, ...action.payload.subcategories];
        state.currentOffset = action.payload.offset + action.payload.subcategories.length;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.error = null;
      })
      .addCase(loadMoreSubCategories.rejected, (state, action) => {
        logRedux('Loading more subcategories - rejected', action.payload);
        state.isLoadingMore = false;
        state.error = action.payload as string;
      });

    // Refresh SubCategories
    builder
      .addCase(refreshSubCategoriesData.pending, (state) => {
        logRedux('Refreshing subcategories - pending');
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshSubCategoriesData.fulfilled, (state, action) => {
        logRedux('Refreshing subcategories - fulfilled', {
          itemsCount: action.payload.subcategories.length,
          total: action.payload.total,
        });
        state.isRefreshing = false;
        state.items = action.payload.subcategories;
        state.currentOffset = action.payload.offset + action.payload.subcategories.length;
        state.totalItems = action.payload.total;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.error = null;
      })
      .addCase(refreshSubCategoriesData.rejected, (state, action) => {
        logRedux('Refreshing subcategories - rejected', action.payload);
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubCategories, clearError, setCurrentCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
