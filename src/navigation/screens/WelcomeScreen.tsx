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
import { useTranslation } from 'react-i18next';
import ImagePath from '../../assets/images/ImagePath';
import { Colors, heightToDp, widthToDp } from '../../utils';
import CarouselSlider from '../../components/CarouselSlider';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  const slides = [
    {
      key: '1',
      title: t('home.welcomeToCompany'),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      key: '2',
      title: t('home.discoverProducts'),
      description: t('home.discoverProductsDesc'),
    },
    {
      key: '3',
      title: t('home.joinCommunity'),
      description: t('home.joinCommunityDesc'),
    },
  ];


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
            title={currentIndex === slides.length - 1 ? t('home.getStarted') : t('common.next')}
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
    backgroundColor: Colors.White,
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