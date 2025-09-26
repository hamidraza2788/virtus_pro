import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform, Alert } from 'react-native';

// Google Sign-In configuration
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    // Try without webClientId first to see if that's the issue
    webClientId: '312747520387-tqgg8sdkbkhq1kj59rt20s8fa4q3avf6.apps.googleusercontent.com',
    // No iOS client ID needed since we only have Android app
    // Optional: Enable offline access
    offlineAccess: true,
    // Optional: Enable server-side authentication
    forceCodeForRefreshToken: true,
  });
};

// Google Sign-In service
export class GoogleSignInService {
  /**
   * Initialize Google Sign-In
   */
  static async initialize() {
    try {
      configureGoogleSignIn();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if Google Play Services are available (Android only)
   */
  static async isPlayServicesAvailable() {
    if (Platform.OS === 'android') {
      try {
        await GoogleSignin.hasPlayServices();
        return true;
      } catch (error) {
        return false;
      }
    }
    return true; // iOS doesn't need this check
  }

  /**
   * Sign in with Google
   */
  static async signIn() {
    try {
      // Check if Google Play Services are available (Android)
      const isPlayServicesAvailable = await this.isPlayServicesAvailable();
      if (!isPlayServicesAvailable) {
        throw new Error('Google Play Services not available');
      }

      // Sign in
      const userInfo = await GoogleSignin.signIn();
      
      
      // Check if userInfo exists and has some user data
      if (!userInfo) {
        console.log('No userInfo received');
        return {
          success: false,
          error: 'No user data received from Google Sign-In1',
        };
      }
      
      // Try to extract user data even if structure is different
      const hasUserData = userInfo.user || userInfo.email || userInfo.name || userInfo.data;
      if (!hasUserData) {
        console.log('No user data found in userInfo');
        return {
          success: false,
          error: 'No user data received from Google Sign-In2',
        };
      }
      
      // Extract user data from the correct structure
      const userData = {
        email: userInfo.data?.user?.email || '',
        name: userInfo.data?.user?.name || '',
      };
      
      return {
        success: true,
        user: userData,
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          success: false,
          error: 'User cancelled the login flow',
        };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return {
          success: false,
          error: 'Sign in is in progress already',
        };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          success: false,
          error: 'Google Play Services not available',
        };
      } else {
        return {
          success: false,
          error: error.message || 'Something went wrong with Google Sign In',
        };
      }
    }
  }

  /**
   * Sign out from Google
   */
  static async signOut() {
    try {
      await GoogleSignin.signOut();
      return {
        success: true,
        message: 'Successfully signed out from Google',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign out from Google',
      };
    }
  }

  /**
   * Check if user is already signed in
   */
  static async isSignedIn() {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      return isSignedIn;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user info
   */
  static async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      if (userInfo && userInfo.data?.user) {
        const userData = {
          email: userInfo.data.user.email || '',
          name: userInfo.data.user.name || '',
        };
        
        return {
          success: true,
          user: userData,
        };
      } else {
        return {
          success: false,
          error: 'No user signed in',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get current user',
      };
    }
  }

  /**
   * Revoke access and sign out
   */
  static async revokeAccess() {
    try {
      await GoogleSignin.revokeAccess();
      return {
        success: true,
        message: 'Successfully revoked access',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to revoke access',
      };
    }
  }
}

export default GoogleSignInService;
