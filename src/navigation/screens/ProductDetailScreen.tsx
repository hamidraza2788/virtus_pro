import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ImageViewing from 'react-native-image-viewing';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  loadProductDetail,
  clearProductDetail,
} from '../../redux/slices/productDetailSlice';
import { ProductDetailResponse, ProductDetailData } from '../../api/productDetailApis';
import { Colors } from '../../utils';
import Loader from '../../components/Loader';
import AppButton from '../../components/AppButton';
import ImagePath from '../../assets/images/ImagePath';

interface RouteParams {
  productId: string;
}

const { width: screenWidth } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { productDetail, isLoading, error } = useAppSelector((state) => state.productDetail);

  const { productId } = route.params as RouteParams;
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load product detail when component mounts
  useEffect(() => {
    console.log('ProductDetailScreen: Loading product detail for ID:', productId);
    
    // Clear previous product detail
    dispatch(clearProductDetail());
    
    // Load product detail
    dispatch(loadProductDetail(productId));

    return () => {
      // Cleanup when component unmounts
      console.log('ProductDetailScreen: Component unmounting, clearing product detail');
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  // Listen for language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Get localized description based on current language
  const getLocalizedDescription = (descriptions: any, type: 'short' | 'long') => {
    const langMap: { [key: string]: string } = {
      'en': 'en',
      'de': 'de', 
      'it': 'it',
      'fr': 'fr',
      'es': 'es',
      'pt': 'pt',
    };

    const currentLang = langMap[currentLanguage] || 'en';
    const descriptionObj = descriptions[type];
    
    if (!descriptionObj) return 'No description available';
    
    return descriptionObj[currentLang] || descriptionObj.en || 'No description available';
  };

  // Get all product images for gallery
  const getAllImages = (productDetail: ProductDetailResponse) => {
    const images = [];
    
    if (productDetail.images?.featured) {
      images.push({ uri: productDetail.images.featured });
    }
    
    if (productDetail.images?.gallery) {
      productDetail.images.gallery.forEach(imageUrl => {
        images.push({ uri: imageUrl });
      });
    }
    
    return images;
  };

  // Handle featured image press (opens gallery)
  const handleFeaturedImagePress = () => {
    if (productDetail) {
      setCurrentImageIndex(selectedImageIndex);
      setVisible(true);
    }
  };

  // Handle gallery image press (changes featured image)
  const handleGalleryImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Handle retry
  const handleRetry = () => {
    dispatch(loadProductDetail(productId));
  };

  // Render product images
  const renderProductImages = () => {
    if (!productDetail?.images) return null;

    const images = getAllImages(productDetail);
    
    if (images.length === 0) return null;

    return (
      <View style={styles.imagesSection}>
        <Text style={styles.sectionTitle}>Product Images</Text>
        
        {/* Featured Image (Big) */}
        <TouchableOpacity
          style={styles.featuredImageContainer}
          onPress={handleFeaturedImagePress}
          activeOpacity={0.8}
        >
          <Image
            source={images[selectedImageIndex]}
            style={styles.featuredImage}
            resizeMode="cover"
            onError={() => console.log('Featured image load error')}
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredLabel}>
              {selectedImageIndex === 0 ? 'Featured' : `Image ${selectedImageIndex + 1}`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Gallery Images (Small) */}
        {images.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.galleryImageContainer,
                  index === selectedImageIndex && styles.activeGalleryImage
                ]}
                onPress={() => handleGalleryImagePress(index)}
                activeOpacity={0.7}
              >
                <Image
                  source={image}
                  style={styles.galleryImage}
                  resizeMode="cover"
                  onError={() => console.log('Gallery image load error for index:', index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  // Render product specifications
  const renderSpecifications = () => {
    if (!productDetail?.data) return null;

    const data = productDetail.data;
    const specifications = [
      { label: 'Product ID', value: productDetail.product_id },
      { label: 'GTIN', value: data['GTIN'] },
      { label: 'Catalogue', value: data['Catalogue'] },
      { label: 'Page', value: data['Page'] },
      { label: 'HS Code', value: data['HS Code'] },
      { label: 'Origin', value: data['Origin'] },
      { label: 'Stock Items', value: data['Stock items'] },
    ].filter(spec => spec.value && spec.value !== '');

    return (
      <View style={styles.specificationsSection}>
        <Text style={styles.sectionTitle}>Product Information</Text>
        {specifications.map((spec, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render dimensions
  const renderDimensions = () => {
    if (!productDetail?.data) return null;

    const data = productDetail.data;
    const dimensions = [
      { label: 'Height (net)', value: data['Height net(m)'], unit: 'm' },
      { label: 'Width (net)', value: data['Width net(m)'], unit: 'm' },
      { label: 'Depth (net)', value: data['Depth net(m)'], unit: 'm' },
      { label: 'Height (gross)', value: data['Height gross(m)'], unit: 'm' },
      { label: 'Width (gross)', value: data['Width gross(m)'], unit: 'm' },
      { label: 'Depth (gross)', value: data['Depth gross(m)'], unit: 'm' },
    ].filter(dim => dim.value && dim.value > 0);

    if (dimensions.length === 0) return null;

    return (
      <View style={styles.dimensionsSection}>
        <Text style={styles.sectionTitle}>Dimensions</Text>
        {dimensions.map((dim, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specLabel}>{dim.label}</Text>
            <Text style={styles.specValue}>{dim.value} {dim.unit}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render technical specifications
  const renderTechnicalSpecs = () => {
    if (!productDetail?.data) return null;

    const data = productDetail.data;
    const technicalSpecs = [
      { label: 'Voltage', value: data['Voltage (V)'] },
      { label: 'Frequency', value: data['Frequency'] },
      { label: 'Phase', value: data['Phase'] },
      { label: 'kW Gas', value: data['kW Gas'] },
      { label: 'kW Electric', value: data['kW Electric'] },
      { label: 'Temperature', value: data['Temperature'] },
      { label: 'Capacity', value: data['Capacity'] },
      { label: 'Productivity', value: data['Productivity'] },
      { label: 'Speed', value: data['Speed'] },
      { label: 'r.p.m.', value: data['r.p.m.'] },
      { label: 'Control', value: data['Control'] },
      { label: 'Water Inlet', value: data['Water inlet'] },
      { label: 'Water Outlet', value: data['Water outlet'] },
      { label: 'Gas Supply', value: data['Gas supply'] },
      { label: 'Energy Class', value: data['Energy class'] },
    ].filter(spec => spec.value && spec.value !== '');

    if (technicalSpecs.length === 0) return null;

    return (
      <View style={styles.technicalSection}>
        <Text style={styles.sectionTitle}>Technical Specifications</Text>
        {technicalSpecs.map((spec, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render weight information
  const renderWeightInfo = () => {
    if (!productDetail?.data) return null;

    const data = productDetail.data;
    const weightInfo = [
      { label: 'Product Weight', value: data['Product weight (kg)'], unit: 'kg' },
      { label: 'Shipping Weight', value: data['Shipping weight (kg)'], unit: 'kg' },
      { label: 'Qty. per Item', value: data['Qty. per item'] },
    ].filter(info => {
      const value = info.value;
      return value !== null && value !== undefined && 
             (typeof value === 'string' ? value !== '' : true);
    });

    if (weightInfo.length === 0) return null;

    return (
      <View style={styles.weightSection}>
        <Text style={styles.sectionTitle}>Weight Information</Text>
        {weightInfo.map((info, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specLabel}>{info.label}</Text>
            <Text style={styles.specValue}>{info.value} {info.unit || ''}</Text>
          </View>
        ))}
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
          onPress={handleRetry}
          style={styles.retryButton}
        />
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No product details found</Text>
        <AppButton
          title="Retry"
          onPress={handleRetry}
          style={styles.retryButton}
        />
      </View>
    );
  };

  if (!productDetail && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={ImagePath.arrowIcon} style={styles.backArrowIcon} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Product Details</Text>
          </View>
        </View>
        <View style={styles.content}>
          {renderError()}
          {renderEmpty()}
        </View>
      </SafeAreaView>
    );
  }

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
            {productDetail?.product_id || 'Product Details'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {productDetail?.catalogue || ''}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderError()}
        
        {productDetail && (
          <>
            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>List Price</Text>
              <Text style={styles.priceValue}>${productDetail.list_price}</Text>
            </View>

            {/* Descriptions */}
            <View style={styles.descriptionsSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.shortDescription}>
                {getLocalizedDescription(productDetail.descriptions, 'short')}
              </Text>
              <Text style={styles.longDescription}>
                {getLocalizedDescription(productDetail.descriptions, 'long')}
              </Text>
            </View>

            {/* Images */}
            {renderProductImages()}

            {/* Specifications */}
            {renderSpecifications()}

            {/* Dimensions */}
            {renderDimensions()}

            {/* Weight Information */}
            {renderWeightInfo()}

            {/* Technical Specifications */}
            {renderTechnicalSpecs()}
          </>
        )}
      </ScrollView>

      {/* Image Gallery */}
      {productDetail && (
        <ImageViewing
          images={getAllImages(productDetail)}
          imageIndex={currentImageIndex}
          visible={visible}
          onRequestClose={() => setVisible(false)}
          onImageIndexChange={(index) => {
            setCurrentImageIndex(index);
            setSelectedImageIndex(index);
          }}
        />
      )}
      
      {/* Show loading overlay for initial load */}
      {isLoading && (
        <Loader
          visible={true}
          message="Loading product details..."
          overlay={true}
          size="large"
          color={Colors.primary}
        />
      )}
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
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 44 : 64,
  },
  priceSection: {
    backgroundColor: Colors.White,
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  descriptionsSection: {
    backgroundColor: Colors.White,
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Black,
    marginBottom: 15,
  },
  shortDescription: {
    fontSize: 16,
    color: Colors.Black,
    marginBottom: 10,
    lineHeight: 22,
  },
  longDescription: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  imagesSection: {
    backgroundColor: Colors.White,
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featuredImageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.LightGray,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  featuredLabel: {
    backgroundColor: Colors.primary,
    color: Colors.White,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  galleryContainer: {
    paddingRight: 20,
  },
  galleryImageContainer: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeGalleryImage: {
    borderColor: Colors.primary,
    elevation: 2,
    shadowOpacity: 0.2,
  },
  galleryImage: {
    width: 80,
    height: 80,
    backgroundColor: Colors.LightGray,
  },
  specificationsSection: {
    backgroundColor: Colors.White,
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dimensionsSection: {
    backgroundColor: Colors.White,
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weightSection: {
    backgroundColor: Colors.White,
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  technicalSection: {
    backgroundColor: Colors.White,
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  specLabel: {
    fontSize: 14,
    color: Colors.secondary,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: Colors.Black,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
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
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
