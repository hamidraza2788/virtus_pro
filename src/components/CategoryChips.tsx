import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils';

const categories = ['All', 'Cooking lines', 'Ovens', 'Refrigeration'];

const CategoryChips = () => {
  const [selected, setSelected] = useState(0);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {categories.map((cat, idx) => (
        <TouchableOpacity
          key={cat}
          style={[styles.chip, selected === idx && styles.chipActive]}
          onPress={() => setSelected(idx)}
        >
          <Text style={[styles.chipText, selected === idx && styles.chipTextActive]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { marginVertical: 8, marginLeft: 20 },
  chip: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.Black,
  },
  chipText: { color: Colors.Black, fontWeight: '600',fontSize:12 },
  chipTextActive: { color: Colors.White },
});

export default CategoryChips;