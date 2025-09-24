# Product Screen Implementation Guide

## Overview
Successfully implemented a complete ProductScreen that displays products when a catalog is clicked, featuring pagination, multi-language support, and a design similar to the ProductList component.

## API Integration

### Products API Configuration
```typescript
// src/api/productsApis.tsx

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';
const DEFAULT_ORIGIN = 'IT';
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'asc';

// Request Format (x-www-form-urlencoded)
const requestData = {
  token: STATIC_TOKEN,
  catalogue: 'Mastro Cook&Snack 11',  // Catalog name from click
  offset: 0,                          // For pagination
  limit: 20,                          // Items per page
  sort: 'asc',                        // asc/desc
  origin: 'IT',                       // Country code
};
```

### API Response Structure
```json
{
  "products": [
    {
      "product_id": "TANDOOR",
      "name": "tandoori oven",
      "short_descriptions": {
        "en": "tandoori oven",
        "de": "Tandoori-Ofen",
        "it": "forno tandoori",
        "fr": "four tandoori",
        "es": "horno tandoori",
        "pt": "Forno tandoori"
      },
      "list_price": "3,771.00",
      "origin": "IN",
      "image": "https://www.virtusnet.de/images/home_info3.jpg"
    }
  ],
  "catalogue": "Mastro Cook&Snack 11",
  "origin": "IN",
  "offset": 0,
  "limit": 20,
  "total": 1
}
```

## Multi-Language Support

### Language Detection
```typescript
// Get localized description based on current language
const getLocalizedDescription = (shortDescriptions: any) => {
  const langMap: { [key: string]: string } = {
    'en': 'en',
    'de': 'de', 
    'it': 'it',
    'fr': 'fr',
    'es': 'es',
    'pt': 'pt',
  };

  const currentLang = langMap[currentLanguage] || 'en';
  return shortDescriptions[currentLang] || shortDescriptions.en || product.name;
};
```

### Supported Languages
- **English (en)** - Default fallback
- **German (de)** - Deutsch
- **Italian (it)** - Italiano
- **French (fr)** - Français
- **Spanish (es)** - Español
- **Portuguese (pt)** - Português

### Language Switching
```typescript
// Listen for language changes from i18n
useEffect(() => {
  setCurrentLanguage(i18n.language);
}, [i18n.language]);
```

## Redux State Management

### Products Slice
```typescript
// src/redux/slices/productsSlice.ts

interface ProductsState {
  items: Product[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentOffset: number;
  totalItems: number;
  hasMoreItems: boolean;
  catalogue: string;
  origin: string;
  sort: 'asc' | 'desc';
}
```

### Async Thunks
```typescript
// Load initial products for a catalog
export const loadInitialProducts = createAsyncThunk(
  'products/loadInitial',
  async (params: { catalogue: string; origin?: string; sort?: 'asc' | 'desc' })
);

// Load more products (pagination)
export const loadMoreProducts = createAsyncThunk(
  'products/loadMore',
  async (params: { catalogue: string; currentOffset: number; origin?: string; sort?: 'asc' | 'desc' })
);

// Refresh products data
export const refreshProductsData = createAsyncThunk(
  'products/refresh',
  async (params: { catalogue: string; origin?: string; sort?: 'asc' | 'desc' })
);
```

## Component Implementation

### ProductScreen Component
```typescript
// src/navigation/screens/ProductScreen.tsx

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Get catalog data from navigation params
  const { catalogue: selectedCatalogue } = route.params as RouteParams;
  
  // Load products on mount
  useEffect(() => {
    dispatch(clearProducts());
    dispatch(loadInitialProducts({
      catalogue: selectedCatalogue.name,
      origin: 'IT',
      sort: 'asc',
    }));
  }, [dispatch, selectedCatalogue.name]);
};
```

### Product Item Rendering
```typescript
const renderProductItem = ({ item }: { item: Product }) => {
  const localizedDescription = getLocalizedDescription(item.short_descriptions);
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {localizedDescription}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{item.list_price}</Text>
          <Text style={styles.origin}>Origin: {item.origin}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
```

## Navigation Flow

### Catalog Click Handler
```typescript
// src/components/CatalogGrid.tsx

const handleCatalogPress = (catalog: CatalogItem) => {
  console.log('Catalog item pressed:', catalog.name);
  
  if (onCatalogPress) {
    onCatalogPress(catalog);
  } else {
    // Navigate to ProductScreen with catalog data
    navigation.navigate('ProductScreen' as never, {
      catalogue: {
        name: catalog.name,
        image: catalog.image,
      },
    } as never);
  }
};
```

### Navigation Stack Configuration
```typescript
// src/navigation/index.tsx

type RootStackParamList = {
  // ... other screens
  ProductScreen: { 
    catalogue: { 
      name: string; 
      image: string; 
    }; 
  };
};

const RootStack = createNativeStackNavigator({
  // ... other screens
  ProductScreen: {
    screen: ProductScreen,
    options: {
      headerShown: false,
    },
  },
});
```

## UI Design Features

### Header Design
```typescript
<View style={styles.header}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.backButtonText}>← Back</Text>
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
```

### Product Card Design
```typescript
const styles = StyleSheet.create({
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
  price: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  origin: {
    color: Colors.secondary,
    fontSize: 10,
    fontStyle: 'italic',
  },
});
```

## Pagination Implementation

### Load More Functionality
```typescript
const handleLoadMore = () => {
  if (!isLoadingMore && hasMoreItems) {
    console.log('Loading more products...');
    dispatch(loadMoreProducts({
      catalogue: selectedCatalogue.name,
      currentOffset: products.length,
      origin: 'IT',
      sort: 'asc',
    }));
  }
};

// In FlatList
<FlatList
  data={products}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.1}
  ListFooterComponent={renderFooter}
/>
```

### Footer Loading Indicator
```typescript
const renderFooter = () => {
  if (!isLoadingMore) return null;
  
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color={Colors.primary} />
      <Text style={styles.footerText}>Loading more products...</Text>
    </View>
  );
};
```

## Pull-to-Refresh

### Refresh Implementation
```typescript
const handleRefresh = () => {
  console.log('Refreshing products data...');
  dispatch(refreshProductsData({
    catalogue: selectedCatalogue.name,
    origin: 'IT',
    sort: 'asc',
  }));
};

// In FlatList
<FlatList
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      colors={[Colors.primary]}
      tintColor={Colors.primary}
    />
  }
/>
```

## Error Handling

### Error States
```typescript
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
```

### Empty State
```typescript
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
```

## Loading States

### Initial Loading
```typescript
{isLoading && (
  <Loader
    visible={true}
    message="Loading products..."
    overlay={true}
    size="large"
    color={Colors.primary}
  />
)}
```

### Load More Loading
- Footer spinner with "Loading more products..." text
- Triggered when scrolling to bottom

### Refresh Loading
- Native pull-to-refresh indicator
- Triggered when pulling down on the list

## User Interactions

### Product Selection
```typescript
const handleProductPress = (product: Product) => {
  console.log('Product pressed:', product.name);
  Alert.alert(
    'Product Details',
    `Name: ${product.name}\nPrice: ${product.list_price}\nID: ${product.product_id}`,
    [{ text: 'OK' }]
  );
};
```

### Back Navigation
```typescript
<TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.goBack()}
>
  <Text style={styles.backButtonText}>← Back</Text>
</TouchableOpacity>
```

## Data Flow

### 1. Catalog Click
```
User clicks catalog → CatalogGrid.handleCatalogPress() → 
navigation.navigate('ProductScreen', { catalogue }) → 
ProductScreen receives params
```

### 2. Product Loading
```
ProductScreen mounts → useEffect triggers → 
dispatch(clearProducts()) → dispatch(loadInitialProducts()) → 
API call to /products.php → Response received → 
Redux state updated → UI re-renders
```

### 3. Pagination
```
User scrolls to bottom → onEndReached triggered → 
handleLoadMore() → dispatch(loadMoreProducts()) → 
API call with offset → More products loaded → 
Redux state updated → UI shows new products
```

### 4. Refresh
```
User pulls down → RefreshControl triggers → 
handleRefresh() → dispatch(refreshProductsData()) → 
API call with offset: 0 → Fresh data loaded → 
Redux state reset → UI shows refreshed data
```

## Console Logging

### Debug Information
```javascript
// Navigation
console.log('Catalog item pressed:', catalog.name);
console.log('ProductScreen: Loading products for catalogue:', selectedCatalogue.name);

// API calls
console.log('[PRODUCTS API] Fetching products data', params);
console.log('[PRODUCTS API] Request data prepared', requestData);
console.log('[PRODUCTS API] Products API response received', responseData);

// Redux actions
console.log('[PRODUCTS REDUX] Loading initial products', params);
console.log('[PRODUCTS REDUX] Initial products loaded successfully', data);
console.log('[PRODUCTS REDUX] Loading more products - pending');

// User interactions
console.log('Product pressed:', product.name);
console.log('Loading more products...');
console.log('Refreshing products data...');
```

## Configuration Options

### Origin Countries
```typescript
const ORIGIN_OPTIONS = [
  'IT', 'TR', 'ES', 'FR', 'CZ', 'PT', 'MT', 'DE', 'ID', 'IN', 'PL'
];
```

### Sort Options
```typescript
const SORT_OPTIONS = ['asc', 'desc'];
```

### Pagination Settings
```typescript
const DEFAULT_LIMIT = 20;
const END_REACHED_THRESHOLD = 0.1; // Trigger at 90% scroll
```

## Performance Optimizations

### FlatList Optimization
```typescript
<FlatList
  data={products}
  keyExtractor={(item, index) => `${item.product_id}-${index}`}
  onEndReachedThreshold={0.1}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={20}
/>
```

### Image Optimization
```typescript
<Image
  source={{ uri: item.image }}
  style={styles.image}
  resizeMode="cover"
  onError={() => console.log('Image load error for:', item.name)}
/>
```

### Memory Management
```typescript
useEffect(() => {
  // Load products
  return () => {
    // Cleanup when component unmounts
    console.log('ProductScreen: Component unmounting, clearing products');
    dispatch(clearProducts());
  };
}, [dispatch, selectedCatalogue.name]);
```

## Testing Scenarios

### 1. Normal Flow
```bash
✅ User clicks catalog → Navigate to ProductScreen → 
   Products load → Display products with descriptions in current language
✅ Scroll to bottom → Load more products → 
   Pagination works correctly
✅ Pull to refresh → Data refreshes → 
   Back to first page with fresh data
```

### 2. Multi-Language
```bash
✅ Change app language → Product descriptions update → 
   Correct language displayed
✅ Unsupported language → Fallback to English → 
   No broken descriptions
```

### 3. Error Scenarios
```bash
✅ Network error → Error message displayed → 
   Retry button works
✅ Empty response → Empty state shown → 
   Pull to refresh works
✅ API timeout → Loading state → 
   Error handling works
```

### 4. Edge Cases
```bash
✅ No more products → Load more disabled → 
   Footer hidden correctly
✅ Fast scrolling → Pagination works → 
   No duplicate requests
✅ Multiple rapid refreshes → Only one active → 
   Proper state management
```

## Files Created/Updated

### New Files:
1. **`src/api/productsApis.tsx`** - Products API functions
2. **`src/redux/slices/productsSlice.ts`** - Products Redux state
3. **`src/navigation/screens/ProductScreen.tsx`** - Product screen component

### Updated Files:
1. **`src/redux/store.ts`** - Added products slice
2. **`src/components/CatalogGrid.tsx`** - Added navigation to ProductScreen
3. **`src/navigation/screens/CatalogScreen.tsx`** - Removed custom handler
4. **`src/navigation/index.tsx`** - Added ProductScreen to navigation stack

## API Request Examples

### Initial Load
```
POST https://virtus-lieferung.de/api/v1/products.php
Content-Type: application/x-www-form-urlencoded

token=4c8a2f97a3f54d58b5e9e2d6d7c4a1b2
catalogue=Mastro Cook&Snack 11
offset=0
limit=20
sort=asc
origin=IT
```

### Load More (Page 2)
```
POST https://virtus-lieferung.de/api/v1/products.php
Content-Type: application/x-www-form-urlencoded

token=4c8a2f97a3f54d58b5e9e2d6d7c4a1b2
catalogue=Mastro Cook&Snack 11
offset=20
limit=20
sort=asc
origin=IT
```

### Refresh
```
POST https://virtus-lieferung.de/api/v1/products.php
Content-Type: application/x-www-form-urlencoded

token=4c8a2f97a3f54d58b5e9e2d6d7c4a1b2
catalogue=Mastro Cook&Snack 11
offset=0
limit=20
sort=asc
origin=IT
```

## Future Enhancements

### 1. Product Details
- **Detail Screen**: Navigate to product detail screen on click
- **Product Images**: Gallery view for multiple images
- **Specifications**: Detailed product specifications

### 2. Search & Filter
- **Search Functionality**: Search within products
- **Price Filter**: Filter by price range
- **Origin Filter**: Filter by origin country

### 3. User Experience
- **Favorites**: Add products to favorites
- **Cart Integration**: Add products to cart
- **Share Functionality**: Share product details

### 4. Performance
- **Caching**: Cache product images locally
- **Offline Support**: Show cached products when offline
- **Lazy Loading**: Load images on demand

The ProductScreen implementation is now complete with full API integration, multi-language support, pagination, and a professional UI design! 🎉
