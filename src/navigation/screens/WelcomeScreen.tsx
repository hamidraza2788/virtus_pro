import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
  Dimensions,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import ImagePath from '../../assets/images/ImagePath';
import { heightToDp, widthToDp } from '../../utils';
import CarouselSlider from '../../components/CarouselSlider';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to our\ncompany',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    key: '2',
    title: 'Discover Products',
    description: 'Browse our catalog and find the best products for your needs.',
  },
  {
    key: '3',
    title: 'Join the Community',
    description: 'Connect with dealers and other users to get the most out of our platform.',
  },
];

const WelcomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  // Set status bar to transparent on mount
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setBarStyle('light-content');
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login' as never);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={ImagePath.BgImage as ImageSourcePropType}
        style={styles.background}
        imageStyle={styles.imageBg}
      >
        <View style={styles.bottomCard}>
          <CarouselSlider
            slides={slides}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            flatListRef={flatListRef}
          />
          <AppButton
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const CARD_HEIGHT = heightToDp(48);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  imageBg: {
    width: widthToDp(100),
    height: heightToDp(100),
    resizeMode: 'cover',
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
    minHeight: CARD_HEIGHT,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default WelcomeScreen;