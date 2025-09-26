import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  loadInitialProducts,
  loadMoreProducts,
  refreshProductsData,
  clearProducts,
} from '../../redux/slices/productsSlice';
import { Product } from '../../api/productsApis';
import { Colors } from '../../utils';
import Loader from '../../components/Loader';
import AppButton from '../../components/AppButton';
import ImagePath from '../../assets/images/ImagePath';

interface RouteParams {
  catalogue: {
    name: string;
    image: string;
    collection_name?: string;
  };
}

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { 
    items: products, 
    isLoading, 
    isRefreshing, 
    isLoadingMore, 
    error, 
    hasMoreItems,
    collection_name,
    language 
  } = useAppSelector((state) => state.products);

  const { catalogue: selectedCatalogue } = route.params as RouteParams;
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Load initial products when component mounts
  useEffect(() => {
    console.log('ProductScreen: Loading products for collection:', selectedCatalogue.collection_name || selectedCatalogue.name);
    
    // Clear previous products data
    dispatch(clearProducts());
    
    // Load initial products
    dispatch(loadInitialProducts({
      collection_name: selectedCatalogue.collection_name || selectedCatalogue.name,
      lang: currentLanguage,
      sort: 'asc',
    }));

    return () => {
      // Cleanup when component unmounts
      console.log('ProductScreen: Component unmounting, clearing products');
      dispatch(clearProducts());
    };
  }, [dispatch, selectedCatalogue.collection_name || selectedCatalogue.name, currentLanguage]);

  // Listen for language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Load more products when reaching the end
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreItems) {
      console.log('Loading more products...');
      dispatch(loadMoreProducts({
        collection_name: selectedCatalogue.collection_name || selectedCatalogue.name,
        currentOffset: products.length,
        lang: currentLanguage,
        sort: 'asc',
      }));
    }
  };

  // Refresh products data
  const handleRefresh = () => {
    console.log('Refreshing products data...');
    dispatch(refreshProductsData({
      collection_name: selectedCatalogue.collection_name || selectedCatalogue.name,
      lang: currentLanguage,
      sort: 'asc',
    }));
  };

  // Handle product press
  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
    
    // Navigate to ProductDetailScreen with product ID
    (navigation as any).navigate('ProductDetailScreen', {
      productId: product.product_id,
    });
  };

  // Render product item
  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.images.featured }}
          style={styles.image}
          resizeMode="cover"
          onError={() => console.log('Image load error for:', item.name)}
        />
        <View style={styles.productInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.collection_name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.price}>${item.price.trim()}</Text>
            {/* <Text style={styles.gtin}>GTIN: {item.gtin || 'N/A'}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render loading indicator for load more
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerText}>Loading more products...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found</Text>
        <Text style={styles.emptySubtext}>Pull to refresh</Text>
        <AppButton
          title="Refresh"
          onPress={handleRefresh}
          style={styles.refreshButton}
        />
      </View>
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <AppButton
          title="Retry"
          onPress={handleRefresh}
          style={styles.retryButton}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={ImagePath.arrowIcon} style={styles.backArrowIcon} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {selectedCatalogue.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {products.length} products
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderError()}
        
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${item.product_id}-${index}`}
          contentContainerStyle={[
            styles.list,
            products.length === 0 && !isLoading && styles.emptyList
          ]}
          renderItem={renderProductItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Show loading overlay for initial load */}
        {isLoading && (
          <Loader
            visible={true}
            message="Loading products..."
            overlay={true}
            size="large"
            color={Colors.primary}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // backgroundColor: Colors.White,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary,
    resizeMode: 'contain',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Black,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.secondary,
  },
  content: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 64,
    paddingTop: 10,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 12,
    marginBottom: 7,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LightGray,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: Colors.LightGray,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 4,
  },
  desc: {
    fontSize: 10,
    color: Colors.secondary,
    marginBottom: 4,
    lineHeight: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  gtin: {
    color: Colors.secondary,
    fontSize: 10,
    fontStyle: 'italic',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 10,
    color: Colors.secondary,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 10,
    paddingHorizontal: 30,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffe6e6',
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#d63031',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
});

export default ProductScreen;
