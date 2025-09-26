import { virtusAxiosInstance } from './axiosInstance';

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'asc';
const DEFAULT_LANG = 'en';

// Types for Products API
export interface ProductImages {
  featured: string;
  gallery: string[];
}

export interface Product {
  product_id: string;
  gtin: string;
  collection_name: string;
  price: string;
  name: string;
  images: ProductImages;
}

export interface ProductsResponse {
  collection_name: string;
  language: string;
  products: Product[];
  offset: number;
  limit: number;
  total: number;
}

export interface ProductsRequest {
  token?: string;
  collection_name: string;
  offset?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  lang?: string;
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
      collection_name: params.collection_name,
      offset: params.offset || 0,
      limit: params.limit || DEFAULT_LIMIT,
      sort: params.sort || DEFAULT_SORT,
      lang: params.lang || DEFAULT_LANG,
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
      collection_name: response.data.collection_name,
      language: response.data.language,
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
 * @param collection_name - Collection name to fetch products for
 * @param lang - Language code (default: en)
 * @returns Promise<ProductsResponse>
 */
export const fetchInitialProducts = async (
  collection_name: string,
  lang: string = DEFAULT_LANG
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    collection_name,
    lang,
    offset: 0,
    limit: DEFAULT_LIMIT,
    sort: DEFAULT_SORT,
  });
};

/**
 * Fetch next page of products data
 * @param collection_name - Collection name
 * @param currentOffset - Current offset
 * @param lang - Language code
 * @param limit - Number of items to fetch (default: 20)
 * @param sort - Sort order (default: asc)
 * @returns Promise<ProductsResponse>
 */
export const fetchNextProductsPage = async (
  collection_name: string,
  currentOffset: number,
  lang: string = DEFAULT_LANG,
  limit: number = DEFAULT_LIMIT,
  sort: 'asc' | 'desc' = DEFAULT_SORT
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    collection_name,
    lang,
    offset: currentOffset,
    limit,
    sort,
  });
};

/**
 * Refresh products data (reset to first page)
 * @param collection_name - Collection name
 * @param lang - Language code
 * @param sort - Sort order (default: asc)
 * @returns Promise<ProductsResponse>
 */
export const refreshProducts = async (
  collection_name: string,
  lang: string = DEFAULT_LANG,
  sort: 'asc' | 'desc' = DEFAULT_SORT
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    collection_name,
    lang,
    offset: 0,
    limit: DEFAULT_LIMIT,
    sort,
  });
};

/**
 * Search products with specific parameters
 * @param collection_name - Collection name
 * @param searchParams - Additional search parameters
 * @returns Promise<ProductsResponse>
 */
export const searchProducts = async (
  collection_name: string,
  searchParams: Partial<ProductsRequest> = {}
): Promise<ProductsResponse> => {
  return fetchProductsApi({
    collection_name,
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
  DEFAULT_LIMIT,
  DEFAULT_SORT,
  DEFAULT_LANG,
};
