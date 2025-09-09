import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import Images from '../assets/images/ImagePath';
import { Colors } from '../utils';

const SearchBar = () => (
<View style={styles.container}>
    <Image source={Images.SearchIcon} style={[styles.icon, { tintColor: Colors.LightBlue }]} />
    <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={Colors.LightBlue}
    />
    <Image source={Images.FilterIcon} style={[styles.icon, { tintColor: Colors.LightBlue }]} />
</View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: { width: 22, height: 22, tintColor: Colors.LightBlue },
  input: { flex: 1, marginHorizontal: 8, fontSize: 16, color: Colors.Black, fontFamily: 'OpenSans-Regular' },
});
export default SearchBar;