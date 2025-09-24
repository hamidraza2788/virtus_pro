import { store } from '../redux/store';
import { setEmail } from '../redux/slices/authSlice';
import StorageUtils from './storage';

/**
 * Initialize authentication state from localStorage
 * This should be called when the app starts to sync Redux with localStorage
 */
export const initializeAuth = async () => {
  try {
    console.log('Initializing auth from localStorage...');
    
    const authData = await StorageUtils.getAuthData();
    
    if (authData.isAuthenticated && authData.userData) {
      console.log('Auth data found in localStorage, syncing with Redux...');
      
      // Dispatch actions to update Redux state
      store.dispatch(setEmail(authData.userData.email));
      
      // You can add more actions here to sync other auth data with Redux
      // For example, if you have actions to set user data, etc.
      
      console.log('Auth initialization completed successfully (no token)');
      return {
        isAuthenticated: true,
        userData: authData.userData,
        accessToken: null, // No token needed
      };
    } else {
      console.log('No auth data found in localStorage');
      return {
        isAuthenticated: false,
        userData: null,
        accessToken: null,
      };
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    return {
      isAuthenticated: false,
      userData: null,
      accessToken: null,
    };
  }
};

/**
 * Check if user is authenticated by checking localStorage
 * This is a quick check without loading all data
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    return await StorageUtils.isUserAuthenticated();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUser = async () => {
  try {
    return await StorageUtils.getUserData();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get current access token from localStorage
 */
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    return await StorageUtils.getAccessToken();
  } catch (error) {
    console.error('Error getting current token:', error);
    return null;
  }
};

export default {
  initializeAuth,
  isAuthenticated,
  getCurrentUser,
  getCurrentToken,
};
