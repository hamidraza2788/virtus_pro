import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  loadInitialCatalog, 
  loadMoreCatalog, 
  refreshCatalogData 
} from '../redux/slices/catalogSlice';
import { CatalogItem } from '../api/catalogApis';

const numColumns = 2;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (Dimensions.get('window').width - 20 * 2 - ITEM_MARGIN) / 2;

interface CatalogGridProps {
  onCatalogPress?: (catalog: CatalogItem) => void;
}

const CatalogGrid: React.FC<CatalogGridProps> = ({ onCatalogPress }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {
    items: catalogItems,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMoreItems
  } = useAppSelector((state) => state.catalog);

  // Load more items when reaching the end
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreItems) {
      console.log('Loading more catalog items...');
      dispatch(loadMoreCatalog(catalogItems.length));
    }
  };

  // Refresh catalog data
  const handleRefresh = () => {
    console.log('Refreshing catalog data...');
    dispatch(refreshCatalogData());
  };

  // Handle catalog item press
  const handleCatalogPress = (catalog: CatalogItem) => {
    console.log('Catalog item pressed:', catalog.name);
    
    if (onCatalogPress) {
      onCatalogPress(catalog);
    } else {
      // Navigate to ProductScreen with catalog data
      (navigation as any).navigate('ProductScreen', {
        catalogue: {
          name: catalog.name,
          image: catalog.image,
        },
      });
    }
  };

  // Render loading indicator for load more
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No catalogs available</Text>
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
    <View style={styles.container}>
      {renderError()}
      
      <FlatList
        data={catalogItems}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={numColumns}
        contentContainerStyle={[
          styles.list,
          catalogItems.length === 0 && !isLoading && styles.emptyList
        ]}
        columnWrapperStyle={catalogItems.length > 0 ? { 
          justifyContent: 'space-between', 
          marginBottom: ITEM_MARGIN 
        } : undefined}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleCatalogPress(item)}
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
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#007AFF',
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

export default CatalogGrid;