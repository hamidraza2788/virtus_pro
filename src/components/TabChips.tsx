import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../utils';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

const tabs = ['All', 'Favorites', 'My orders'];

const TabChips = () => {
  const [selected, setSelected] = useState(0);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {tabs.map((tab, idx) => (
        <TouchableOpacity
          key={tab}
          style={[styles.chip, selected === idx && styles.chipActive]}
          onPress={() => setSelected(idx)}
        >
          <Text style={[styles.chipText, selected === idx && styles.chipTextActive]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginVertical: 8, marginLeft: 20 },
  chip: {
    backgroundColor: Colors.White,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
  chipActive: {
    backgroundColor: Colors.Black,
    borderColor: Colors.Black,
  },
  chipText: { color: Colors.Black, fontWeight: '500' },
  chipTextActive: { color: Colors.White },
});
export default TabChips;