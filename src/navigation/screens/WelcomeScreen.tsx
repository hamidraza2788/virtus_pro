import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
  Dimensions,
  FlatList,
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
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // TODO: Navigate to next screen
      navigation.navigate('Login' as never);
    }
  };

  return (
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
  );
};

const CARD_HEIGHT = heightToDp(48);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBg: {
    width: widthToDp(100),
    height: heightToDp(100),
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
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