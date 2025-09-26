import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  loadInitialCatalog
} from '../redux/slices/catalogSlice';
import { CatalogItem } from '../api/catalogApis';
import { Colors } from '../utils';

const ITEM_WIDTH = Dimensions.get('window').width * 0.55;

interface FeaturedCategoriesCarouselProps {
  onCategoryPress?: (category: CatalogItem) => void;
}

const FeaturedCategoriesCarousel: React.FC<FeaturedCategoriesCarouselProps> = ({ onCategoryPress }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {
    items: catalogItems,
    isLoading,
    error
  } = useAppSelector((state) => state.catalog);

  // Load initial catalog data when component mounts
  useEffect(() => {
    dispatch(loadInitialCatalog());
  }, [dispatch]);

  // Handle category press
  const handleCategoryPress = (category: CatalogItem) => {
    
    if (onCategoryPress) {
      onCategoryPress(category);
    } else {
      // Navigate to SubCategoryScreen with category name
      (navigation as any).navigate('SubCategoryScreen', {
        categoryName: category.name,
      });
    }
  };

  // Render category item
  const renderCategoryItem = ({ item }: { item: CatalogItem }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
    </TouchableOpacity>
  );

  // Render loading state
  const renderLoading = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading categories</Text>
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
          data={catalogItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={renderCategoryItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  list: {
    paddingLeft: 20,
    paddingVertical: 8,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: Colors.White,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 12,
    marginBottom: 15,
    color: Colors.Black,
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

export default FeaturedCategoriesCarousel;
