import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  loadInitialSubCategories, 
  loadMoreSubCategories, 
  refreshSubCategoriesData,
  clearSubCategories 
} from '../../redux/slices/subCategorySlice';
import { SubCategoryItem } from '../../api/catalogApis';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../utils';
import Loader from '../../components/Loader';
import ImagePath from '../../assets/images/ImagePath';

const numColumns = 2;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (Dimensions.get('window').width - 20 * 2 - ITEM_MARGIN) / 2;

type SubCategoryScreenRouteProp = RouteProp<{
  SubCategoryScreen: {
    categoryName: string;
  };
}, 'SubCategoryScreen'>;

const SubCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<SubCategoryScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { categoryName } = route.params;
  
  const {
    items: subCategoryItems,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMoreItems
  } = useAppSelector((state) => state.subCategory);

  // Load initial subcategories when component mounts
  useEffect(() => {
    console.log('SubCategoryScreen: Loading subcategories for category:', categoryName);
    dispatch(clearSubCategories());
    dispatch(loadInitialSubCategories(categoryName));
  }, [dispatch, categoryName]);

  // Load more items when reaching the end
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreItems) {
      console.log('Loading more subcategory items...');
      dispatch(loadMoreSubCategories({ 
        category: categoryName, 
        currentOffset: subCategoryItems.length 
      }));
    }
  };

  // Refresh subcategory data
  const handleRefresh = () => {
    console.log('Refreshing subcategory data...');
    dispatch(refreshSubCategoriesData(categoryName));
  };

  // Handle subcategory item press
  const handleSubCategoryPress = (subCategory: SubCategoryItem) => {
    console.log('SubCategory item pressed:', subCategory.name);
    console.log('Collection name:', subCategory.collection_name);
    
    // Navigate to ProductScreen with subcategory data
    (navigation as any).navigate('ProductScreen', {
      catalogue: {
        name: subCategory.name,
        image: subCategory.image,
        collection_name: subCategory.collection_name,
      },
    });
  };

  // Render loading indicator for load more
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No subcategories available</Text>
        <Text style={styles.emptySubtext}>Pull to refresh</Text>
      </View>
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
            {categoryName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {subCategoryItems.length} subcategories
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        {renderError()}
        
        <FlatList
          data={subCategoryItems}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.list,
            subCategoryItems.length === 0 && !isLoading && styles.emptyList
          ]}
          columnWrapperStyle={subCategoryItems.length > 0 ? { 
            justifyContent: 'space-between', 
            marginBottom: ITEM_MARGIN 
          } : undefined}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => handleSubCategoryPress(item)}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: item.image }} 
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay} />
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
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
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Show loading overlay for initial load */}
        {isLoading && (
          <Loader
            visible={true}
            message="Loading subcategories..."
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
    paddingBottom: Platform.OS === 'ios' ? 50 : 60,
    paddingTop: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    width: ITEM_WIDTH,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
    backgroundColor: '#eee',
    justifyContent: 'flex-end',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    margin: 12,
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SubCategoryScreen;
