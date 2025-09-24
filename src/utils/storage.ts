import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  IS_AUTHENTICATED: 'is_authenticated',
} as const;

// User data interface
export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_image?: string;        // Image filename from server
  profile_image_url?: string;    // Complete image URL from server
  created_at: string;
}

// Storage utility functions
export const StorageUtils = {
  // Save user data
  saveUserData: async (userData: UserData): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('User data saved to localStorage:', userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Get user data
  getUserData: async (): Promise<UserData | null> => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('User data retrieved from localStorage:', parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Save access token
  saveAccessToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      console.log('Access token saved to localStorage');
    } catch (error) {
      console.error('Error saving access token:', error);
      throw error;
    }
  },

  // Get access token
  getAccessToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      console.log('Access token retrieved from localStorage:', token ? 'exists' : 'null');
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  // Save refresh token
  saveRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      console.log('Refresh token saved to localStorage');
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  },

  // Get refresh token
  getRefreshToken: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      console.log('Refresh token retrieved from localStorage:', token ? 'exists' : 'null');
      return token;
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // Save authentication status
  saveAuthStatus: async (isAuthenticated: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(isAuthenticated));
      console.log('Authentication status saved to localStorage:', isAuthenticated);
    } catch (error) {
      console.error('Error saving auth status:', error);
      throw error;
    }
  },

  // Get authentication status
  getAuthStatus: async (): Promise<boolean> => {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      const isAuthenticated = status ? JSON.parse(status) : false;
      console.log('Authentication status retrieved from localStorage:', isAuthenticated);
      return isAuthenticated;
    } catch (error) {
      console.error('Error getting auth status:', error);
      return false;
    }
  },

  // Save complete authentication data (no tokens needed)
  saveAuthData: async (userData: UserData, accessToken?: string, refreshToken?: string): Promise<void> => {
    try {
      await Promise.all([
        StorageUtils.saveUserData(userData),
        StorageUtils.saveAuthStatus(true),
        // Save empty tokens if provided (for backward compatibility)
        ...(accessToken ? [StorageUtils.saveAccessToken(accessToken)] : []),
        ...(refreshToken ? [StorageUtils.saveRefreshToken(refreshToken)] : []),
      ]);
      console.log('Complete authentication data saved to localStorage (no tokens)');
    } catch (error) {
      console.error('Error saving complete auth data:', error);
      throw error;
    }
  },

  // Get complete authentication data
  getAuthData: async (): Promise<{
    userData: UserData | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
  }> => {
    try {
      const [userData, accessToken, refreshToken, isAuthenticated] = await Promise.all([
        StorageUtils.getUserData(),
        StorageUtils.getAccessToken(),
        StorageUtils.getRefreshToken(),
        StorageUtils.getAuthStatus(),
      ]);

      return {
        userData,
        accessToken,
        refreshToken,
        isAuthenticated,
      };
    } catch (error) {
      console.error('Error getting complete auth data:', error);
      return {
        userData: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    }
  },

  // Clear all authentication data
  clearAuthData: async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED),
      ]);
      console.log('All authentication data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  // Check if user is authenticated (no token required)
  isUserAuthenticated: async (): Promise<boolean> => {
    try {
      const authData = await StorageUtils.getAuthData();
      const isAuthenticated = authData.isAuthenticated && authData.userData;
      
      console.log('Authentication check result (no token):', {
        isAuthenticated: authData.isAuthenticated,
        hasUserData: !!authData.userData,
        finalResult: isAuthenticated
      });
      
      return isAuthenticated;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },
};

export default StorageUtils;
