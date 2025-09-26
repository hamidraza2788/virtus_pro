import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadInitialCatalog } from '../../redux/slices/catalogSlice';
import CatalogHeader from '../../components/CatalogHeader';
import CatalogGrid from '../../components/CatalogGrid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../utils';
import Loader from '../../components/Loader';

const CatalogScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.catalog);

  // Load initial catalog data when component mounts
  useEffect(() => {
    dispatch(loadInitialCatalog());
  }, [dispatch]);

  // Note: Catalog navigation is now handled in CatalogGrid component

  return (
    <SafeAreaView style={styles.container}>
      <CatalogHeader />
      <View style={styles.content}>
        <CatalogGrid />
        
        {/* Show loading overlay for initial load */}
        {isLoading && (
          <Loader
            visible={true}
            message="Loading catalogs..."
            overlay={true}
            size="large"
            color={Colors.primary}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CatalogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  content: {
    flex: 1,
  },
});