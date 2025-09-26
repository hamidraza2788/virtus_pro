import { virtusAxiosInstance } from './axiosInstance';
import { fetchInitialCatalog } from './catalogApis';
import { fetchInitialSubCategories } from './catalogApis';
import { fetchInitialProducts } from './productsApis';

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';
const DEFAULT_LIMIT = 20;
const DEFAULT_LANG = 'en';

// Types for Featured Products API
export interface FeaturedProduct {
  product_id: string;
  gtin: string;
  collection_name: string;
  price: string;
  name: string;
  images: {
    featured: string;
    gallery: string[];
  };
}

export interface FeaturedProductsResponse {
  collection_name: string;
  language: string;
  products: FeaturedProduct[];
  offset: number;
  limit: number;
  total: number;
}

// Custom logger for API calls
const logAPI = (message: string, data?: any) => {
  // Logging removed for production
};

/**
 * Fetch featured products by getting first category, first subcategory, and its products
 * @param lang - Language code (default: en)
 * @returns Promise<FeaturedProductsResponse>
 */
export const fetchFeaturedProducts = async (lang: string = DEFAULT_LANG): Promise<FeaturedProductsResponse> => {
  try {
    logAPI('Fetching featured products', { lang });

    // Step 1: Get first category
    logAPI('Step 1: Getting first category');
    const catalogResponse = await fetchInitialCatalog();
    
    if (!catalogResponse.categories || catalogResponse.categories.length === 0) {
      throw new Error('No categories found');
    }

    const firstCategory = catalogResponse.categories[0];
    logAPI('First category found', { name: firstCategory.name });

    // Step 2: Get first subcategory of the first category
    logAPI('Step 2: Getting first subcategory', { category: firstCategory.name });
    const subCategoriesResponse = await fetchInitialSubCategories(firstCategory.name);
    
    if (!subCategoriesResponse.subcategories || subCategoriesResponse.subcategories.length === 0) {
      throw new Error('No subcategories found for the first category');
    }

    const firstSubCategory = subCategoriesResponse.subcategories[0];
    logAPI('First subcategory found', { 
      name: firstSubCategory.name, 
      collection_name: firstSubCategory.collection_name 
    });

    // Step 3: Get products from the first subcategory
    logAPI('Step 3: Getting products from first subcategory', { 
      collection_name: firstSubCategory.collection_name 
    });
    const productsResponse = await fetchInitialProducts(
      firstSubCategory.collection_name,
      lang
    );

    logAPI('Featured products loaded successfully', {
      category: firstCategory.name,
      subcategory: firstSubCategory.name,
      collection_name: firstSubCategory.collection_name,
      productsCount: productsResponse.products.length,
      total: productsResponse.total,
    });

    return productsResponse;
  } catch (error: any) {
    logAPI('Featured products API error', {
      message: error.message,
      step: 'fetchFeaturedProducts',
    });

    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

/**
 * Fetch featured products with custom parameters
 * @param params - Custom parameters for featured products
 * @returns Promise<FeaturedProductsResponse>
 */
export const fetchFeaturedProductsCustom = async (params: {
  lang?: string;
  limit?: number;
}): Promise<FeaturedProductsResponse> => {
  try {
    logAPI('Fetching featured products with custom params', params);

    // Get first category
    const catalogResponse = await fetchInitialCatalog();
    if (!catalogResponse.categories || catalogResponse.categories.length === 0) {
      throw new Error('No categories found');
    }

    const firstCategory = catalogResponse.categories[0];

    // Get first subcategory
    const subCategoriesResponse = await fetchInitialSubCategories(firstCategory.name);
    if (!subCategoriesResponse.subcategories || subCategoriesResponse.subcategories.length === 0) {
      throw new Error('No subcategories found for the first category');
    }

    const firstSubCategory = subCategoriesResponse.subcategories[0];

    // Get products with custom limit
    const productsResponse = await fetchInitialProducts(
      firstSubCategory.collection_name,
      params.lang || DEFAULT_LANG
    );

    // Limit products if custom limit is provided
    if (params.limit && productsResponse.products.length > params.limit) {
      productsResponse.products = productsResponse.products.slice(0, params.limit);
    }

    logAPI('Featured products with custom params loaded', {
      productsCount: productsResponse.products.length,
      limit: params.limit,
    });

    return productsResponse;
  } catch (error: any) {
    logAPI('Featured products custom API error', {
      message: error.message,
    });

    throw error;
  }
};

export default {
  fetchFeaturedProducts,
  fetchFeaturedProductsCustom,
  STATIC_TOKEN,
  DEFAULT_LIMIT,
  DEFAULT_LANG,
};
