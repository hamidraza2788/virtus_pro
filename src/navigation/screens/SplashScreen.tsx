import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StorageUtils from '../../utils/storage';
import { initializeAuth } from '../../utils/authInitializer';
import ImagePath from '../../assets/images/ImagePath';
import { Colors } from '../../utils';
import Loader from '../../components/Loader';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [debugInfo, setDebugInfo] = useState({
    isAuthenticated: false,
    hasToken: false,
    hasUserData: false,
  });

  useEffect(() => {
    let isMounted = true; // Flag to prevent navigation after component unmounts
    let fallbackTimeout: NodeJS.Timeout;

    const checkAuthentication = async () => {
      try {
        console.log('SplashScreen: Starting authentication check...');
        setLoadingMessage('Loading app...');
        
        // Add a minimum splash time for better UX
        const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));
        await minSplashTime;
        
        // Check if component is still mounted
        if (!isMounted) return;
        
        setLoadingMessage('Checking authentication...');
        
        // Initialize auth state from localStorage and sync with Redux
        const authState = await initializeAuth();
        
        // Check if component is still mounted
        if (!isMounted) return;
        
        // Get detailed auth data for debugging
        const authData = await StorageUtils.getAuthData();
        setDebugInfo({
          isAuthenticated: authData.isAuthenticated,
          hasToken: false, // No token needed
          hasUserData: !!authData.userData,
        });
        
        console.log('SplashScreen: Auth status check (no token):', {
          isAuthenticated: authData.isAuthenticated,
          hasUserData: !!authData.userData,
          isUserLoggedIn: authState.isAuthenticated
        });
        
        if (authState.isAuthenticated) {
          console.log('SplashScreen: User is authenticated, navigating to HomeTabs');
          // User is logged in, navigate to HomeTabs
          navigation.navigate('HomeTabs' as never);
        } else {
          console.log('SplashScreen: User not authenticated, navigating to WelcomeScreen');
          // User is not logged in, navigate to WelcomeScreen
          navigation.navigate('WelcomeScreen' as never);
        }
        
        // Clear the fallback timeout since we've successfully navigated
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout);
        }
      } catch (error) {
        console.log('SplashScreen: Auth check error:', error);
        // On error, navigate to WelcomeScreen as fallback
        if (isMounted) {
          navigation.navigate('WelcomeScreen' as never);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuthentication();

    // Fallback timeout in case something goes wrong (only if still checking)
    fallbackTimeout = setTimeout(() => {
      if (isMounted && isCheckingAuth) {
        console.log('SplashScreen: Fallback timeout reached, navigating to WelcomeScreen');
        setIsCheckingAuth(false);
        navigation.navigate('WelcomeScreen' as never);
      }
    }, 10000); // 10 seconds fallback

    return () => {
      isMounted = false; // Mark component as unmounted
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, [navigation, isCheckingAuth]);

  return (
    <View style={styles.container}>
      <Image
        source={ImagePath.Logo}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Loader
        visible={isCheckingAuth}
        message={loadingMessage}
        overlay={false}
        size="small"
        color={Colors.primary}
      />
      
      {/* Debug information - remove in production */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>Authenticated: {debugInfo.isAuthenticated ? 'Yes' : 'No'}</Text>
          <Text style={styles.debugText}>Token Required: No</Text>
          <Text style={styles.debugText}>Has User Data: {debugInfo.hasUserData ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  debugContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
  },
});

export default SplashScreen;
