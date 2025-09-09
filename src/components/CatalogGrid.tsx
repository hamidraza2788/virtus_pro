import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import ImagePath from '../assets/images/ImagePath';


const categories = [
  { id: '1', title: 'COOK & CHILL', image: ImagePath.Product1 },
  { id: '2', title: 'DISHWASHING', image: ImagePath.Product2 },
  { id: '3', title: 'Ovens', image: ImagePath.Product3 },
  { id: '4', title: 'Refrigeration', image: ImagePath.Product4 },
  { id: '5', title: 'Food distribution', image: ImagePath.Product5 },
  { id: '6', title: 'Hospitality', image: ImagePath.Product6 },
  { id: '7', title: 'Food distribution', image: ImagePath.Product7 },
  { id: '8', title: 'Hospitality', image: ImagePath.Product8 },
];

const numColumns = 2;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (Dimensions.get('window').width - 20 * 2 - ITEM_MARGIN) / 2;

const CatalogGrid = () => (
  <FlatList
    data={categories}
    keyExtractor={item => item.id}
    numColumns={numColumns}
    contentContainerStyle={styles.list}
    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: ITEM_MARGIN }}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.card}>
        <Image source={item.image} style={styles.image} />
        {/* <View style={styles.overlay} /> */}
        {/* <Text style={styles.cardTitle}>{item.title}</Text> */}
      </TouchableOpacity>
    )}
    scrollEnabled={false}
  />
);

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 8,
  },
  card: {
    width: ITEM_WIDTH,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
    backgroundColor: '#eee',
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    margin: 12,
    zIndex: 2,
  },
});

export default CatalogGrid;