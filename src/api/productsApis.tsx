import { virtusAxiosInstance } from './axiosInstance';

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';
const DEFAULT_ORIGIN = 'IT';
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'asc';

// Types for Products API
export interface ShortDescriptions {
  en: string;
  de: string;
  it: string;
  fr: string;
  es: string;
  pt: string;
}

export interface Product {
  product_id: string;
  name: string;
  short_descriptions: ShortDescriptions;
  list_price: string;
  origin: string;
  image: string;
}

export interface ProductsResponse {
  products: Product[];
  catalogue: string;
  origin: string;
  offset: number;
  limit: number;
  total: number;
}

export interface ProductsRequest {
  token?: string;
  catalogue: string;
  offset?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  origin?: string;
}

// Custom logger for API calls
const logAPI = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[PRODUCTS API] ${message}`, data || '');
  }
};

/**
 * Fetch products data from Virtus API
 * @param params - Request parameters
 * @returns Promise<ProductsResponse>
 */
export const fetchProductsApi = async (params: ProductsRequest): Promise<ProductsResponse> => {
  try {
    logAPI('Fetching products data', params);

    // Prepare request data with defaults
    const requestData = {
      token: params.token || STATIC_TOKEN,
      catalogue: params.catalogue,
      offset: params.offset || 0,
      limit: params.limit || DEFAULT_LIMIT,
      sort: params.sort || DEFAULT_SORT,
      origin: params.origin || DEFAULT_ORIGIN,
    };

    logAPI('Request data prepared', requestData);

    // Make API call using virtusAxiosInstance (for product APIs)
    const response = await virtusAxiosInstance.post('/products.php', requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logAPI('Products API response received', {
      status: response.status,
      dataLength: response.data.products?.length || 0,
      total: response.data.total,
      catalogue: response.data.catalogue,
    });

    return response.data;
  } catch (error: any) {
    logAPI('Products API error', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

/**
 * Fetch initial products data (first page)
 * @param catalogue - Catalogue name to fetch products for
 * @param origin - Origin country code (default: IT)
 * @returns Promise<ProductsResponse>
 */
export const fetchInitialProducts = async (
  catalogue: string,
  origin: string = DEFAULT_ORIGIN
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    catalogue,
    origin,
    offset: 0,
    limit: DEFAULT_LIMIT,
    sort: DEFAULT_SORT,
  });
};

/**
 * Fetch next page of products data
 * @param catalogue - Catalogue name
 * @param currentOffset - Current offset
 * @param origin - Origin country code
 * @param limit - Number of items to fetch (default: 20)
 * @param sort - Sort order (default: asc)
 * @returns Promise<ProductsResponse>
 */
export const fetchNextProductsPage = async (
  catalogue: string,
  currentOffset: number,
  origin: string = DEFAULT_ORIGIN,
  limit: number = DEFAULT_LIMIT,
  sort: 'asc' | 'desc' = DEFAULT_SORT
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    catalogue,
    origin,
    offset: currentOffset,
    limit,
    sort,
  });
};

/**
 * Refresh products data (reset to first page)
 * @param catalogue - Catalogue name
 * @param origin - Origin country code
 * @param sort - Sort order (default: asc)
 * @returns Promise<ProductsResponse>
 */
export const refreshProducts = async (
  catalogue: string,
  origin: string = DEFAULT_ORIGIN,
  sort: 'asc' | 'desc' = DEFAULT_SORT
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    catalogue,
    origin,
    offset: 0,
    limit: DEFAULT_LIMIT,
    sort,
  });
};

/**
 * Search products with specific parameters
 * @param catalogue - Catalogue name
 * @param searchParams - Additional search parameters
 * @returns Promise<ProductsResponse>
 */
export const searchProducts = async (
  catalogue: string,
  searchParams: Partial<ProductsRequest> = {}
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    catalogue,
    ...searchParams,
  });
};

export default {
  fetchProductsApi,
  fetchInitialProducts,
  fetchNextProductsPage,
  refreshProducts,
  searchProducts,
  STATIC_TOKEN,
  DEFAULT_ORIGIN,
  DEFAULT_LIMIT,
  DEFAULT_SORT,
};
