import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Images from '../assets/images/ImagePath';
import { Colors } from '../utils';

const HomeHeader = () => (
  <View style={styles.header}>
    <Image source={Images.Profile} style={styles.avatar} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.deliverTo}>Deliver To <Text style={styles.locationArrow}>▼</Text></Text>
      <Text style={styles.location}>120 San Fransisco, USA</Text>
    </View>
    <TouchableOpacity>
      <View style={styles.bellWrapper}>
        <Image source={Images.BellIcon} style={styles.bell} />
        <View style={styles.redDot} />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  deliverTo: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  location: { color: Colors.secondary, fontWeight: 'bold', fontSize: 15 },
  locationArrow: { fontSize: 12 },
  bellWrapper: { position: 'relative' },
  bell: { width: 24, height: 24, marginLeft: 8 },
  redDot: {
    position: 'absolute',
    top: 1,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: Colors.White,
  },
});
export default HomeHeader;