import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchFeaturedProducts,
  fetchFeaturedProductsCustom,
  FeaturedProduct,
  FeaturedProductsResponse 
} from '../../api/featuredProductsApis';

// Custom logger for Redux
const logRedux = (message: string, data?: any) => {
  // Logging removed for production
};

// Initial state
interface FeaturedProductsState {
  items: FeaturedProduct[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  totalItems: number;
  collection_name: string;
  language: string;
}

const initialState: FeaturedProductsState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  totalItems: 0,
  collection_name: '',
  language: 'en',
};

// Async thunks
export const loadFeaturedProducts = createAsyncThunk(
  'featuredProducts/loadFeatured',
  async (lang: string = 'en', { rejectWithValue }) => {
    try {
      logRedux('Loading featured products', { lang });
      const response = await fetchFeaturedProducts(lang);
      logRedux('Featured products loaded successfully', {
        itemsCount: response.products.length,
        total: response.total,
        collection_name: response.collection_name,
        language: response.language,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading featured products', error.message);
      return rejectWithValue(error.message || 'Failed to load featured products');
    }
  }
);

export const loadFeaturedProductsCustom = createAsyncThunk(
  'featuredProducts/loadFeaturedCustom',
  async (params: { lang?: string; limit?: number }, { rejectWithValue }) => {
    try {
      logRedux('Loading featured products with custom params', params);
      const response = await fetchFeaturedProductsCustom(params);
      logRedux('Featured products with custom params loaded successfully', {
        itemsCount: response.products.length,
        total: response.total,
        collection_name: response.collection_name,
        language: response.language,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading featured products with custom params', error.message);
      return rejectWithValue(error.message || 'Failed to load featured products');
    }
  }
);

export const refreshFeaturedProducts = createAsyncThunk(
  'featuredProducts/refresh',
  async (lang: string = 'en', { rejectWithValue }) => {
    try {
      logRedux('Refreshing featured products', { lang });
      const response = await fetchFeaturedProducts(lang);
      logRedux('Featured products refreshed successfully', {
        itemsCount: response.products.length,
        total: response.total,
        collection_name: response.collection_name,
        language: response.language,
      });
      return response;
    } catch (error: any) {
      logRedux('Error refreshing featured products', error.message);
      return rejectWithValue(error.message || 'Failed to refresh featured products');
    }
  }
);

// Slice
const featuredProductsSlice = createSlice({
  name: 'featuredProducts',
  initialState,
  reducers: {
    clearFeaturedProducts: (state) => {
      logRedux('Clearing featured products state');
      state.items = [];
      state.totalItems = 0;
      state.collection_name = '';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      logRedux('Setting featured products language', action.payload);
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load Featured Products
    builder
      .addCase(loadFeaturedProducts.pending, (state) => {
        logRedux('Loading featured products - pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFeaturedProducts.fulfilled, (state, action) => {
        logRedux('Loading featured products - fulfilled', {
          itemsCount: action.payload.products.length,
          total: action.payload.total,
          collection_name: action.payload.collection_name,
          language: action.payload.language,
        });
        state.isLoading = false;
        state.items = action.payload.products;
        state.totalItems = action.payload.total;
        state.collection_name = action.payload.collection_name;
        state.language = action.payload.language;
        state.error = null;
      })
      .addCase(loadFeaturedProducts.rejected, (state, action) => {
        logRedux('Loading featured products - rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load Featured Products Custom
    builder
      .addCase(loadFeaturedProductsCustom.pending, (state) => {
        logRedux('Loading featured products custom - pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFeaturedProductsCustom.fulfilled, (state, action) => {
        logRedux('Loading featured products custom - fulfilled', {
          itemsCount: action.payload.products.length,
          total: action.payload.total,
          collection_name: action.payload.collection_name,
          language: action.payload.language,
        });
        state.isLoading = false;
        state.items = action.payload.products;
        state.totalItems = action.payload.total;
        state.collection_name = action.payload.collection_name;
        state.language = action.payload.language;
        state.error = null;
      })
      .addCase(loadFeaturedProductsCustom.rejected, (state, action) => {
        logRedux('Loading featured products custom - rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Featured Products
    builder
      .addCase(refreshFeaturedProducts.pending, (state) => {
        logRedux('Refreshing featured products - pending');
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshFeaturedProducts.fulfilled, (state, action) => {
        logRedux('Refreshing featured products - fulfilled', {
          itemsCount: action.payload.products.length,
          total: action.payload.total,
          collection_name: action.payload.collection_name,
          language: action.payload.language,
        });
        state.isRefreshing = false;
        state.items = action.payload.products;
        state.totalItems = action.payload.total;
        state.collection_name = action.payload.collection_name;
        state.language = action.payload.language;
        state.error = null;
      })
      .addCase(refreshFeaturedProducts.rejected, (state, action) => {
        logRedux('Refreshing featured products - rejected', action.payload);
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearFeaturedProducts, 
  clearError, 
  setLanguage 
} = featuredProductsSlice.actions;
export default featuredProductsSlice.reducer;
