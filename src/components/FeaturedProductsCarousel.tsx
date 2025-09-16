import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import ImagePath from '../assets/images/ImagePath';
import { Colors } from '../utils';


const data = [
    { id: '1', title: 'COOK & CHILL', image: ImagePath.SlideImage2, tag: 'COOK & CHILL' },
    { id: '2', title: 'DISHWASHING', image: ImagePath.SlideImage1, tag: 'DISHWASH' },
];

const ITEM_WIDTH = Dimensions.get('window').width * 0.55;

const FeaturedProductsCarousel = () => (
  <FlatList
    data={data}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    contentContainerStyle={{ paddingLeft: 20, paddingVertical: 8 }}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>★ 4.7 Good</Text>
          <Text style={styles.price}>$10</Text>
        </View>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    backgroundColor: Colors.White,
    borderRadius: 16,
    marginRight: 16,
    // padding: 12,
    // paddingTop:0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
// resizeMode:'contain',
    marginBottom: 8,
  },
  tagContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#C6FF00',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#222',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 12,
    marginBottom: 2,
    color: Colors.Black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  rating: {
    fontSize: 13,
    color: Colors.Black,
  },
  price: {
    fontSize: 12,
    color: Colors.secondary,
  },
});

export default FeaturedProductsCarousel;