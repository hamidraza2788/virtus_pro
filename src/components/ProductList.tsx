import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePath from '../assets/images/ImagePath';
import { Colors } from '../utils';

const products = [
  {
    id: '1',
    title: 'Refrigeration',
    desc: 'Designed to make the most of your kitchen',
    price: '$10.21',
    oldPrice: '$13.00',
    image: ImagePath.Product11,
    qty: 1,
  },
   {
    id: '2',
    title: 'Refrigeration',
    desc: 'Designed to make the most of your kitchen',
    price: '$10.21',
    oldPrice: '$13.00',
    image: ImagePath.Product22,
    qty: 1,
  },
   {
    id: '3',
    title: 'Refrigeration',
    desc: 'Designed to make the most of your kitchen',
    price: '$10.21',
    oldPrice: '$13.00',
    image: ImagePath.Product33,
    qty: 1,
  },
  // Add more product objects as needed
];

const ProductList = () => (
  <FlatList
    data={products}
    keyExtractor={item => item.id}
    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 44 }}
    renderItem={({ item }) => (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.oldPrice}>{item.oldPrice}</Text>
          </View>
        </View>
        <View style={styles.qtyBox}>
            <TouchableOpacity style={styles.minusBtn}>
            <Text style={styles.minus}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.qty}</Text>
          <TouchableOpacity style={styles.plusBtn}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
     scrollEnabled={false} // <-- Add this line
  />
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 12,
    marginBottom: 7,
    alignItems: 'center',
    borderWidth:1,
    borderColor:Colors.LightGray
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 4,
  },
  desc: {
    fontSize: 10,
    color: Colors.Gray,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: Colors.Purple,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  oldPrice: {
    color: Colors.Gray,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  qtyBox: {
    alignItems: 'center',
    marginLeft: 12,
  },
   minusBtn: {
    backgroundColor: Colors.LightGray,
    borderRadius: 5,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: 14,
  },
  qty: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    marginTop:4,
    color: Colors.Purple,
  },
  plusBtn: {
    backgroundColor: Colors.Purple,
    borderRadius: 5,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: Colors.White,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProductList;