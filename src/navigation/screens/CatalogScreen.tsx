import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CatalogHeader from '../../components/CatalogHeader';
import CatalogGrid from '../../components/CatalogGrid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../utils';

const CatalogScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CatalogHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CatalogGrid />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CatalogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
});