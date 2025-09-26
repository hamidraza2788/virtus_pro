import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  fetchInitialProducts, 
  fetchNextProductsPage, 
  refreshProducts,
  Product,
  ProductsResponse 
} from '../../api/productsApis';

// Custom logger for Redux
const logRedux = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[PRODUCTS REDUX] ${message}`, data || '');
  }
};

// Initial state
interface ProductsState {
  items: Product[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentOffset: number;
  totalItems: number;
  hasMoreItems: boolean;
  collection_name: string;
  language: string;
  sort: 'asc' | 'desc';
}

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  currentOffset: 0,
  totalItems: 0,
  hasMoreItems: false,
  collection_name: '',
  language: 'en', // Default language
  sort: 'asc', // Default sort
};

// Async thunks
export const loadInitialProducts = createAsyncThunk(
  'products/loadInitial',
  async (params: { collection_name: string; lang?: string; sort?: 'asc' | 'desc' }, { rejectWithValue }) => {
    try {
      logRedux('Loading initial products', params);
      const response = await fetchInitialProducts(
        params.collection_name,
        params.lang || 'en'
      );
      logRedux('Initial products loaded successfully', {
        itemsCount: response.products.length,
        total: response.total,
        collection_name: response.collection_name,
        language: response.language,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading initial products', error.message);
      return rejectWithValue(error.message || 'Failed to load products');
    }
  }
);

export const loadMoreProducts = createAsyncThunk(
  'products/loadMore',
  async (params: { 
    collection_name: string; 
    currentOffset: number; 
    lang?: string; 
    sort?: 'asc' | 'desc' 
  }, { rejectWithValue }) => {
    try {
      logRedux('Loading more products', params);
      const response = await fetchNextProductsPage(
        params.collection_name,
        params.currentOffset,
        params.lang || 'en',
        20, // Default limit
        params.sort || 'asc'
      );
      logRedux('More products loaded successfully', {
        newItemsCount: response.products.length,
        newOffset: response.offset,
        totalItems: params.currentOffset + response.products.length,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading more products', error.message);
      return rejectWithValue(error.message || 'Failed to load more items');
    }
  }
);

export const refreshProductsData = createAsyncThunk(
  'products/refresh',
  async (params: { 
    collection_name: string; 
    lang?: string; 
    sort?: 'asc' | 'desc' 
  }, { rejectWithValue }) => {
    try {
      logRedux('Refreshing products data', params);
      const response = await refreshProducts(
        params.collection_name,
        params.lang || 'en',
        params.sort || 'asc'
      );
      logRedux('Products data refreshed successfully', {
        itemsCount: response.products.length,
        total: response.total,
        collection_name: response.collection_name,
        language: response.language,
      });
      return response;
    } catch (error: any) {
      logRedux('Error refreshing products data', error.message);
      return rejectWithValue(error.message || 'Failed to refresh products');
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      logRedux('Clearing products state');
      state.items = [];
      state.currentOffset = 0;
      state.totalItems = 0;
      state.hasMoreItems = false;
      state.collection_name = '';
      state.error = null;
    },
    setCollectionName: (state, action: PayloadAction<string>) => {
      logRedux('Setting products collection name', action.payload);
      state.collection_name = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      logRedux('Setting products language', action.payload);
      state.language = action.payload;
    },
    setSort: (state, action: PayloadAction<'asc' | 'desc'>) => {
      logRedux('Setting products sort order', action.payload);
      state.sort = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load Initial Products
    builder
      .addCase(loadInitialProducts.pending, (state) => {
        logRedux('Loading initial products - pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadInitialProducts.fulfilled, (state, action) => {
        logRedux('Loading initial products - fulfilled', {
          itemsCount: action.payload.products.length,
          total: action.payload.total,
          collection_name: action.payload.collection_name,
          language: action.payload.language,
        });
        state.isLoading = false;
        state.items = action.payload.products;
        state.currentOffset = action.payload.offset + action.payload.products.length;
        state.totalItems = action.payload.total;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.collection_name = action.payload.collection_name;
        state.language = action.payload.language;
        state.error = null;
      })
      .addCase(loadInitialProducts.rejected, (state, action) => {
        logRedux('Loading initial products - rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Load More Products
    builder
      .addCase(loadMoreProducts.pending, (state) => {
        logRedux('Loading more products - pending');
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        logRedux('Loading more products - fulfilled', {
          newItemsCount: action.payload.products.length,
          totalItems: state.items.length + action.payload.products.length,
        });
        state.isLoadingMore = false;
        state.items = [...state.items, ...action.payload.products];
        state.currentOffset = action.payload.offset + action.payload.products.length;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.error = null;
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        logRedux('Loading more products - rejected', action.payload);
        state.isLoadingMore = false;
        state.error = action.payload as string;
      });

    // Refresh Products
    builder
      .addCase(refreshProductsData.pending, (state) => {
        logRedux('Refreshing products - pending');
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshProductsData.fulfilled, (state, action) => {
        logRedux('Refreshing products - fulfilled', {
          itemsCount: action.payload.products.length,
          total: action.payload.total,
          collection_name: action.payload.collection_name,
          language: action.payload.language,
        });
        state.isRefreshing = false;
        state.items = action.payload.products;
        state.currentOffset = action.payload.offset + action.payload.products.length;
        state.totalItems = action.payload.total;
        state.hasMoreItems = state.currentOffset < action.payload.total;
        state.collection_name = action.payload.collection_name;
        state.language = action.payload.language;
        state.error = null;
      })
      .addCase(refreshProductsData.rejected, (state, action) => {
        logRedux('Refreshing products - rejected', action.payload);
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearProducts, 
  setCollectionName, 
  setLanguage, 
  setSort, 
  clearError 
} = productsSlice.actions;
export default productsSlice.reducer;
