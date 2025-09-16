import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePath from '../../assets/images/ImagePath';
import { Colors } from '../../utils';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigate to WelcomeScreen after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('WelcomeScreen' as never);
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={ImagePath.Logo}
        style={styles.logo}
        resizeMode="contain"
      />
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
});

export default SplashScreen;
