import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import HomeHeader from '../../components/HomeHeader';
import SearchBar from '../../components/SearchBar';
import CategoryChips from '../../components/CategoryChips';
import { Colors } from '../../utils';
import FeaturedProductsCarousel from '../../components/FeaturedProductsCarousel';
import SectionHeader from '../../components/SectionHeader';
import TabChips from '../../components/TabChips';
import ProductList from '../../components/ProductList';
import { SafeAreaView } from 'react-native-safe-area-context';


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <SearchBar />
        <CategoryChips />
        <FeaturedProductsCarousel />
        <SectionHeader title="Recommended For You" showSeeAll />
        <TabChips />
        <ProductList /> 
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
});