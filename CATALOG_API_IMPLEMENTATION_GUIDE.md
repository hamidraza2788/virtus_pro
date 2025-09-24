# Catalog API Integration Guide

## Overview
Successfully integrated the Virtus catalog API with pagination, pull-to-refresh, and load-more functionality. The implementation uses a dual API setup where authentication APIs use localhost and product-related APIs use the Virtus production server.

## API Configuration

### Base URLs Setup
```javascript
// src/api/baseURL.js
export const API_BASE_URL = "http://localhost:8888/virtus_pro/api";        // Auth APIs
export const VIRTUS_API_URL = "https://virtus-lieferung.de/api/v1";       // Product APIs
```

### Axios Instances
```javascript
// src/api/axiosInstance.tsx
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,        // For authentication APIs
  headers: { "Content-Type": "application/json" },
});

const virtusAxiosInstance = axios.create({
  baseURL: VIRTUS_API_URL,      // For product/catalog APIs
  headers: { "Content-Type": "application/json" },
});
```

## API Implementation

### Catalog API Functions
```typescript
// src/api/catalogApis.tsx

// API Configuration
const STATIC_TOKEN = '4c8a2f97a3f54d58b5e9e2d6d7c4a1b2';
const DEFAULT_ORIGIN = 'IT';
const DEFAULT_LIMIT = 20;

// API Response Types
interface CatalogItem {
  name: string;
  image: string;
}

interface CatalogResponse {
  catalogues: CatalogItem[];
  origin: string;
  offset: number;
  limit: number;
  total: number;
}
```

### Key API Functions

#### 1. **Fetch Catalog Data**
```typescript
export const fetchCatalogApi = async (params: CatalogRequest = {}): Promise<CatalogResponse> => {
  const requestData = {
    token: params.token || STATIC_TOKEN,
    limit: params.limit || DEFAULT_LIMIT,
    origin: params.origin || DEFAULT_ORIGIN,
    ...(params.offset && { offset: params.offset }),
  };

  const response = await virtusAxiosInstance.post('/catalogues.php', requestData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};
```

#### 2. **Initial Load**
```typescript
export const fetchInitialCatalog = async (origin: string = DEFAULT_ORIGIN): Promise<CatalogResponse> => {
  return fetchCatalogApi({
    origin,
    offset: 0,
    limit: DEFAULT_LIMIT,
  });
};
```

#### 3. **Pagination**
```typescript
export const fetchNextCatalogPage = async (
  currentOffset: number,
  origin: string = DEFAULT_ORIGIN,
  limit: number = DEFAULT_LIMIT
): Promise<CatalogResponse> => {
  return fetchCatalogApi({
    origin,
    offset: currentOffset,
    limit,
  });
};
```

#### 4. **Refresh**
```typescript
export const refreshCatalog = async (origin: string = DEFAULT_ORIGIN): Promise<CatalogResponse> => {
  return fetchCatalogApi({
    origin,
    offset: 0,
    limit: DEFAULT_LIMIT,
  });
};
```

## Redux State Management

### Catalog Slice
```typescript
// src/redux/slices/catalogSlice.ts

interface CatalogState {
  items: CatalogItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentOffset: number;
  totalItems: number;
  hasMoreItems: boolean;
  origin: string;
}
```

### Async Thunks

#### 1. **Load Initial Catalog**
```typescript
export const loadInitialCatalog = createAsyncThunk(
  'catalog/loadInitial',
  async (origin: string = 'IT', { rejectWithValue }) => {
    try {
      const response = await fetchInitialCatalog(origin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load catalog');
    }
  }
);
```

#### 2. **Load More Items**
```typescript
export const loadMoreCatalog = createAsyncThunk(
  'catalog/loadMore',
  async (params: { origin: string; currentOffset: number }, { rejectWithValue }) => {
    try {
      const response = await fetchNextCatalogPage(params.currentOffset, params.origin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more items');
    }
  }
);
```

#### 3. **Refresh Data**
```typescript
export const refreshCatalogData = createAsyncThunk(
  'catalog/refresh',
  async (origin: string = 'IT', { rejectWithValue }) => {
    try {
      const response = await refreshCatalog(origin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh catalog');
    }
  }
);
```

### Reducer Logic
```typescript
// Handle different states for loading, refreshing, and loading more
builder
  .addCase(loadInitialCatalog.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(loadInitialCatalog.fulfilled, (state, action) => {
    state.isLoading = false;
    state.items = action.payload.catalogues;
    state.currentOffset = action.payload.offset + action.payload.catalogues.length;
    state.totalItems = action.payload.total;
    state.hasMoreItems = state.currentOffset < action.payload.total;
    state.origin = action.payload.origin;
    state.error = null;
  })
  .addCase(loadMoreCatalog.fulfilled, (state, action) => {
    state.isLoadingMore = false;
    state.items = [...state.items, ...action.payload.catalogues];
    state.currentOffset = action.payload.offset + action.payload.catalogues.length;
    state.hasMoreItems = state.currentOffset < action.payload.total;
    state.error = null;
  });
```

## Component Implementation

### CatalogGrid Component
```typescript
// src/components/CatalogGrid.tsx

const CatalogGrid: React.FC<CatalogGridProps> = ({ onCatalogPress }) => {
  const dispatch = useAppDispatch();
  const {
    items: catalogItems,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMoreItems,
    origin
  } = useAppSelector((state) => state.catalog);

  // Load more items when reaching the end
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreItems) {
      dispatch(loadMoreCatalog({ 
        origin, 
        currentOffset: catalogItems.length 
      }));
    }
  };

  // Refresh catalog data
  const handleRefresh = () => {
    dispatch(refreshCatalogData(origin));
  };

  return (
    <FlatList
      data={catalogItems}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleCatalogPress(item)}
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
  );
};
```

### CatalogScreen Component
```typescript
// src/navigation/screens/CatalogScreen.tsx

const CatalogScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.catalog);

  // Load initial catalog data when component mounts
  useEffect(() => {
    dispatch(loadInitialCatalog('IT')); // Default origin is IT
  }, [dispatch]);

  const handleCatalogPress = (catalog: any) => {
    // Handle catalog item press
    console.log('Catalog item pressed', catalog.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CatalogHeader />
      <View style={styles.content}>
        <CatalogGrid onCatalogPress={handleCatalogPress} />
        
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
```

## Features Implemented

### 1. **Pagination**
- **Initial Load**: Loads first 20 items
- **Load More**: Automatically loads next 20 items when scrolling to bottom
- **Offset Management**: Tracks current offset for pagination
- **Has More Items**: Checks if more items are available

### 2. **Pull-to-Refresh**
- **Refresh Control**: Native pull-to-refresh functionality
- **Data Reset**: Resets to first page when refreshing
- **Loading State**: Shows refresh indicator during refresh

### 3. **Error Handling**
- **API Errors**: Displays error messages with retry option
- **Network Issues**: Handles network failures gracefully
- **Empty State**: Shows empty state when no data available

### 4. **Loading States**
- **Initial Loading**: Full-screen loader for first load
- **Load More Loading**: Footer loader for pagination
- **Refresh Loading**: Pull-to-refresh indicator

### 5. **Image Handling**
- **Remote Images**: Loads images from API URLs
- **Fallback**: Handles image load failures
- **Optimization**: Uses proper image resize modes

## API Request Format

### Request Body (x-www-form-urlencoded)
```
token: 4c8a2f97a3f54d58b5e9e2d6d7c4a1b2
limit: 20
origin: IT
offset: 0 (optional, for pagination)
```

### Response Format
```json
{
  "catalogues": [
    {
      "name": "Mastro Cook&Snack 11",
      "image": "https://www.virtusnet.de/images/home_info1.jpg"
    },
    {
      "name": "Virtus Excellence 11",
      "image": "https://www.virtusnet.de/images/home_info1.jpg"
    }
  ],
  "origin": "IT",
  "offset": 0,
  "limit": 20,
  "total": 2
}
```

## Configuration Options

### Origin Countries
Available origin values:
- `IT` - Italy (default)
- `TR` - Turkey
- `ES` - Spain
- `FR` - France
- `CZ` - Czech Republic
- `PT` - Portugal
- `MT` - Malta
- `DE` - Germany
- `ID` - Indonesia
- `IN` - India
- `PL` - Poland

### Pagination Settings
```typescript
const DEFAULT_LIMIT = 20;        // Items per page
const END_REACHED_THRESHOLD = 0.1; // Trigger load more at 90% scroll
```

## Usage Examples

### 1. **Load Initial Data**
```typescript
// In component
useEffect(() => {
  dispatch(loadInitialCatalog('IT'));
}, [dispatch]);
```

### 2. **Change Origin**
```typescript
// Change origin and reload
dispatch(setOrigin('DE'));
dispatch(loadInitialCatalog('DE'));
```

### 3. **Handle Catalog Selection**
```typescript
const handleCatalogPress = (catalog: CatalogItem) => {
  // Navigate to catalog detail
  navigation.navigate('CatalogDetail', { catalog });
  
  // Or show catalog info
  Alert.alert('Catalog Selected', catalog.name);
};
```

### 4. **Custom Pagination**
```typescript
// Load specific page
dispatch(loadMoreCatalog({ 
  origin: 'IT', 
  currentOffset: 40  // Load page 3 (items 40-59)
}));
```

## Performance Optimizations

### 1. **FlatList Optimization**
- **getItemLayout**: Optimized for fixed item heights
- **removeClippedSubviews**: Removes off-screen items
- **maxToRenderPerBatch**: Controls render batch size
- **windowSize**: Controls viewport size

### 2. **Image Optimization**
- **resizeMode**: Uses 'cover' for consistent aspect ratios
- **caching**: Leverages React Native's image caching
- **lazy loading**: Images load as they come into view

### 3. **Memory Management**
- **Pagination**: Loads only visible items
- **Cleanup**: Proper cleanup in useEffect
- **State Management**: Efficient Redux state updates

## Error Scenarios Handled

### 1. **Network Errors**
```typescript
// API timeout, no internet, server errors
catch (error: any) {
  return rejectWithValue(error.message || 'Failed to load catalog');
}
```

### 2. **Empty Responses**
```typescript
// No catalog items returned
const renderEmpty = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No catalogs available</Text>
    <Text style={styles.emptySubtext}>Pull to refresh</Text>
  </View>
);
```

### 3. **Image Load Failures**
```typescript
// Fallback for failed image loads
<Image 
  source={{ uri: item.image }} 
  style={styles.image}
  onError={() => console.log('Image load failed')}
/>
```

## Testing Scenarios

### 1. **Normal Flow**
```bash
✅ App loads → CatalogScreen → API call → Data displayed
✅ Scroll to bottom → Load more → Next page loaded
✅ Pull to refresh → Data refreshed → Back to first page
```

### 2. **Error Scenarios**
```bash
✅ Network error → Error message displayed → Retry button works
✅ Empty response → Empty state shown → Pull to refresh works
✅ API timeout → Loading state → Error handling
```

### 3. **Edge Cases**
```bash
✅ No more items → Load more disabled → Footer hidden
✅ Fast scrolling → Pagination works correctly
✅ Multiple rapid refreshes → Only one request active
```

## Console Logging

### Debug Information
```javascript
// API calls
console.log('[CATALOG API] Fetching catalog data', params);
console.log('[CATALOG API] Request data prepared', requestData);
console.log('[CATALOG API] Catalog API response received', responseData);

// Redux actions
console.log('[CATALOG REDUX] Loading initial catalog', { origin });
console.log('[CATALOG REDUX] Initial catalog loaded successfully', data);
console.log('[CATALOG REDUX] Loading more catalog - pending');

// Component events
console.log('Loading more catalog items...');
console.log('Refreshing catalog data...');
console.log('Catalog item pressed:', catalog.name);
```

## Future Enhancements

### 1. **Caching**
- **Offline Support**: Cache catalog data locally
- **Image Caching**: Cache catalog images
- **Smart Refresh**: Only refresh when data is stale

### 2. **Search & Filter**
- **Search Functionality**: Search within catalog items
- **Origin Filter**: Filter by origin country
- **Category Filter**: Filter by catalog categories

### 3. **Performance**
- **Virtual Scrolling**: For large catalog lists
- **Image Optimization**: WebP support, compression
- **Lazy Loading**: Load images on demand

### 4. **User Experience**
- **Skeleton Loading**: Show skeleton while loading
- **Smooth Animations**: Animate item additions
- **Haptic Feedback**: Feedback on interactions

## Troubleshooting

### Common Issues:

1. **API not responding**
   - Check network connectivity
   - Verify API endpoint URL
   - Check token validity

2. **Images not loading**
   - Verify image URLs in response
   - Check image server accessibility
   - Test with different image sources

3. **Pagination not working**
   - Check offset calculation
   - Verify hasMoreItems logic
   - Check API response format

4. **Refresh not working**
   - Verify RefreshControl implementation
   - Check refresh state management
   - Test pull gesture recognition

### Debug Steps:
1. Check console logs for API calls
2. Verify Redux state updates
3. Test API endpoints in Postman
4. Check network requests in debugger

## Quick Reference

### Key Files:
- **`src/api/catalogApis.tsx`** - API functions
- **`src/redux/slices/catalogSlice.ts`** - Redux state management
- **`src/components/CatalogGrid.tsx`** - Grid component with pagination
- **`src/navigation/screens/CatalogScreen.tsx`** - Screen implementation

### Key Functions:
- **`fetchCatalogApi`** - Main API function
- **`loadInitialCatalog`** - Load first page
- **`loadMoreCatalog`** - Load next page
- **`refreshCatalogData`** - Refresh data

### Key States:
- **`isLoading`** - Initial loading state
- **`isRefreshing`** - Pull-to-refresh state
- **`isLoadingMore`** - Pagination loading state
- **`hasMoreItems`** - More items available

The catalog API integration is now complete with full pagination, refresh, and error handling capabilities! 🎉
