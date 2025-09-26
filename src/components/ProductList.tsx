import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  loadFeaturedProducts,
  clearFeaturedProducts 
} from '../redux/slices/featuredProductsSlice';
import { FeaturedProduct } from '../api/featuredProductsApis';
import { Colors } from '../utils';

const ProductList = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {
    items: featuredProducts,
    isLoading,
    error
  } = useAppSelector((state) => state.featuredProducts);

  // Load featured products when component mounts
  useEffect(() => {
    dispatch(clearFeaturedProducts());
    dispatch(loadFeaturedProducts('en')); // Default to English, can be made dynamic
  }, [dispatch]);

  // Handle product press
  const handleProductPress = (product: FeaturedProduct) => {
    
    // Navigate to ProductDetailScreen with product ID
    (navigation as any).navigate('ProductDetailScreen', {
      productId: product.product_id,
    });
  };

  // Render product item
  const renderProductItem = ({ item }: { item: FeaturedProduct }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.images.featured }} 
        style={styles.image}
        resizeMode="cover"
        onError={() => {}}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.collection_name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${item.price.trim()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  const renderLoading = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading featured products...</Text>
      </View>
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading featured products</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderError()}
      
      {isLoading ? (
        renderLoading()
      ) : (
        <FlatList
          data={featuredProducts}
          keyExtractor={(item, index) => `${item.product_id}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={renderProductItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 44 : 64,
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
    color: Colors.secondary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  oldPrice: {
    color: Colors.secondary,
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
    color: Colors.primary,
  },
  plusBtn: {
    backgroundColor: Colors.primary,
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
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: Colors.secondary,
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#d63031',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProductList;