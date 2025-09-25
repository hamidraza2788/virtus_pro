import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProductDetail, ProductDetailResponse } from '../../api/productDetailApis';

// Custom logger for Redux
const logRedux = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[PRODUCT DETAIL REDUX] ${message}`, data || '');
  }
};

// Initial state
interface ProductDetailState {
  productDetail: ProductDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  currentProductId: string | null;
}

const initialState: ProductDetailState = {
  productDetail: null,
  isLoading: false,
  error: null,
  currentProductId: null,
};

// Async thunks
export const loadProductDetail = createAsyncThunk(
  'productDetail/load',
  async (itemCode: string, { rejectWithValue }) => {
    try {
      logRedux('Loading product detail', { itemCode });
      const response = await fetchProductDetail(itemCode);
      logRedux('Product detail loaded successfully', {
        productId: response.product_id,
        hasImages: !!response.images,
        hasDescriptions: !!response.descriptions,
        hasData: !!response.data,
      });
      return response;
    } catch (error: any) {
      logRedux('Error loading product detail', error.message);
      return rejectWithValue(error.message || 'Failed to load product detail');
    }
  }
);

// Slice
const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState,
  reducers: {
    clearProductDetail: (state) => {
      logRedux('Clearing product detail state');
      state.productDetail = null;
      state.currentProductId = null;
      state.error = null;
    },
    setCurrentProductId: (state, action: PayloadAction<string>) => {
      logRedux('Setting current product ID', action.payload);
      state.currentProductId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load Product Detail
    builder
      .addCase(loadProductDetail.pending, (state) => {
        logRedux('Loading product detail - pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadProductDetail.fulfilled, (state, action) => {
        logRedux('Loading product detail - fulfilled', {
          productId: action.payload.product_id,
          catalogue: action.payload.catalogue,
          listPrice: action.payload.list_price,
        });
        state.isLoading = false;
        state.productDetail = action.payload;
        state.currentProductId = action.payload.product_id;
        state.error = null;
      })
      .addCase(loadProductDetail.rejected, (state, action) => {
        logRedux('Loading product detail - rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductDetail, setCurrentProductId, clearError } = productDetailSlice.actions;
export default productDetailSlice.reducer;
