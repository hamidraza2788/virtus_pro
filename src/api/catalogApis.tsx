import { virtusAxiosInstance } from './axiosInstance';

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';
const DEFAULT_LIMIT = 20;

// Types for Catalog API
export interface CatalogItem {
  name: string;
  image: string;
}

export interface CatalogResponse {
  categories: CatalogItem[];
  offset: number;
  limit: number;
  total: number;
}

export interface CatalogRequest {
  token?: string;
  limit?: number;
  offset?: number;
}

// Custom logger for API calls
const logAPI = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[CATALOG API] ${message}`, data || '');
  }
};

/**
 * Fetch catalog data from Virtus API
 * @param params - Request parameters
 * @returns Promise<CatalogResponse>
 */
export const fetchCatalogApi = async (params: CatalogRequest = {}): Promise<CatalogResponse> => {
  try {
    logAPI('Fetching catalog data', params);

    // Prepare request data with defaults
    const requestData = {
      token: params.token || STATIC_TOKEN,
      limit: params.limit || DEFAULT_LIMIT,
    };

    logAPI('Request data prepared', requestData);

    // Make API call using virtusAxiosInstance (for product APIs)
    const response = await virtusAxiosInstance.post('/categories.php', requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logAPI('Catalog API response received', {
      status: response.status,
      dataLength: response.data.categories?.length || 0,
      total: response.data.total,
    });

    return response.data;
  } catch (error: any) {
    logAPI('Catalog API error', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

/**
 * Fetch initial catalog data (first page)
 * @returns Promise<CatalogResponse>
 */
export const fetchInitialCatalog = async (): Promise<CatalogResponse> => {
  return fetchCatalogApi({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });
};

/**
 * Fetch next page of catalog data
 * @param currentOffset - Current offset
 * @param limit - Number of items to fetch (default: 20)
 * @returns Promise<CatalogResponse>
 */
export const fetchNextCatalogPage = async (
  currentOffset: number,
  limit: number = DEFAULT_LIMIT
): Promise<CatalogResponse> => {
  return fetchCatalogApi({
    offset: currentOffset,
    limit,
  });
};

/**
 * Refresh catalog data (reset to first page)
 * @returns Promise<CatalogResponse>
 */
export const refreshCatalog = async (): Promise<CatalogResponse> => {
  return fetchCatalogApi({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });
};

export default {
  fetchCatalogApi,
  fetchInitialCatalog,
  fetchNextCatalogPage,
  refreshCatalog,
  STATIC_TOKEN,
  DEFAULT_LIMIT,
};
