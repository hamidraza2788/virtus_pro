import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../utils';

const { width } = Dimensions.get('window');

interface Slide {
  key: string;
  title: string;
  description: string;
}

interface CarouselSliderProps {
  slides: Slide[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  flatListRef: any;
}

const CarouselSlider: React.FC<CarouselSliderProps> = ({
  slides,
  currentIndex,
  setCurrentIndex,
  flatListRef,
}) => {
  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Text style={styles.title}>
        {item.title} <Text style={styles.wave}>👋</Text>
      </Text>
      <Text style={styles.subtitle}>{item.description}</Text>
    </View>
  );

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={{ flexGrow: 0 }}
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
    slide: {
        width: width - 56,
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontWeight: '600',
        color: Colors.Black,
        textAlign: 'center',
        marginBottom: 14,
        lineHeight: 41,
      
    },
    wave: {
        fontSize: 26,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.secondary,
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
       
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 28,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.Gray,
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: Colors.primary,
        width: 18,
    },
});

export default CarouselSlider;