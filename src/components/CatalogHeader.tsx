import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Images from '../assets/images/ImagePath';
import { Colors } from '../utils';

const CatalogHeader = () => (
  <View style={styles.header}>
 <View style={[styles.iconView,{backgroundColor:Colors.Background}]} ></View>
    <Text style={styles.title}>Product catalog</Text>
    <TouchableOpacity style={styles.iconView}>
      <Image source={Images.SearchIcon} style={styles.icon} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
   
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Black
  },
  iconView:{
    width:50,
    height:50,
    backgroundColor:Colors.White,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center'
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: Colors.Black,
    alignSelf:'center'
  },
});

export default CatalogHeader;