import { virtusAxiosInstance } from './axiosInstance';

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';

// Types for Product Detail API
export interface ProductImages {
  featured: string;
  gallery: string[];
}

export interface ProductDescriptions {
  short: {
    en: string;
    de: string;
    it: string;
    fr: string;
    es: string;
    pt: string;
  };
  long: {
    en: string;
    de: string;
    it: string;
    fr: string;
    es: string;
    pt: string;
  };
}

export interface ProductDetailData {
  'Virtus Item code': string;
  'GTIN': string;
  'Origin': string;
  'Virtus': string;
  'Mastro': string;
  'Mastro GO': string;
  'Mastro PRO': string;
  'Ristormarkt': string;
  'Gierre': string;
  'Sogece': string;
  'OEM': string;
  'GSA': string;
  'List Price': number;
  'Catalogue': string;
  'Page': string;
  'Stock items': string;
  'HS Code': string;
  'Height gross(m)': number;
  'Width gross(m)': number;
  'Depth gross(m)': number;
  'Height net(m)': number;
  'Width net(m)': number;
  'Depth net(m)': number;
  'Product weight (kg)': number;
  'Shipping weight (kg)': number;
  'Qty. per item': number;
  'Parcel shipping': string;
  'Bulky items (freight charges on Request)': string;
  'Supply': string;
  'Energy class': string;
  'Refrigerant gas': string;
  'Voltage (V)': string;
  'kW Gas': string;
  'kW Electric': string;
  'kW Oven Gas': string;
  'kW Oven Electric': string;
  'Frequency': string;
  'Phase': string;
  'Temperature': string;
  'Ambient temperature': string;
  'Temperature oven': string;
  'Capacity': string;
  'Productivity': string;
  'Speed': string;
  'r.p.m.': string;
  'Control': string;
  'Water inlet': string;
  'Water outlet': string;
  'Gas supply': string;
  'Packaging': string;
  'Cooling type': string;
  'max. humidity': string;
  'coolant quantity': string;
  'minimum water pressure': string;
  'water inlet temperature': string;
  'heating type': string;
  'current': string;
  'Note WEB D': string;
  'Note WEB E': string;
  'Note WEB F': string;
  'Note WEB GB': string;
  'Note WEB H': string;
  'Note WEB I': string;
  [key: string]: string | number; // Allow for additional dynamic keys
}

export interface ProductDetailResponse {
  product_id: string;
  gtin: string;
  catalogue: string;
  list_price: number;
  images: ProductImages;
  descriptions: ProductDescriptions;
  data: ProductDetailData;
}

export interface ProductDetailRequest {
  token?: string;
  item_code: string;
}

// Custom logger for API calls
const logAPI = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[PRODUCT DETAIL API] ${message}`, data || '');
  }
};

/**
 * Fetch product detail data from Virtus API
 * @param params - Request parameters
 * @returns Promise<ProductDetailResponse>
 */
export const fetchProductDetailApi = async (params: ProductDetailRequest): Promise<ProductDetailResponse> => {
  try {
    logAPI('Fetching product detail data', params);

    // Prepare request data with defaults
    const requestData = {
      token: params.token || STATIC_TOKEN,
      item_code: params.item_code,
    };

    logAPI('Request data prepared', requestData);

    // Make API call using virtusAxiosInstance (for product APIs)
    const response = await virtusAxiosInstance.post('/product_detail.php', requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logAPI('Product detail API response received', {
      status: response.status,
      productId: response.data.product_id,
      hasImages: !!response.data.images,
      hasDescriptions: !!response.data.descriptions,
      hasData: !!response.data.data,
    });

    return response.data;
  } catch (error: any) {
    logAPI('Product detail API error', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

/**
 * Fetch product detail by item code
 * @param itemCode - Product item code (product_id)
 * @returns Promise<ProductDetailResponse>
 */
export const fetchProductDetail = async (itemCode: string): Promise<ProductDetailResponse> => {
  return fetchProductDetailApi({
    item_code: itemCode,
  });
};

export default {
  fetchProductDetailApi,
  fetchProductDetail,
  STATIC_TOKEN,
};
