// export const API_BASE_URL = "http://localhost:3001/api/v1";
// export const API_BASE_URL = "http://134.199.140.30:3001/api/v1";
export const API_BASE_URL = "http://localhost:8888/virtus_pro/api";
export const ERP_API_URL = "http://13.201.161.9:8093/ms-web/api";

// Image path utilities
export const IMAGE_BASE_URL = "http://localhost:8888/virtus_pro";

// Profile image path utilities
export const getProfileImageUrl = (imageName) => {
  if (!imageName) return null;
  
  // If it's already a complete URL, return as is
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // If it's just a filename, construct the full URL
  return `${IMAGE_BASE_URL}/uploads/profile_images/${imageName}`;
};

// Generic image URL utility
export const getImageUrl = (imageName, folder = 'uploads') => {
  if (!imageName) return null;
  
  // If it's already a complete URL, return as is
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // If it's just a filename, construct the full URL
  return `${IMAGE_BASE_URL}/${folder}/${imageName}`;
};

// Product image URL utility
export const getProductImageUrl = (imageName) => {
  return getImageUrl(imageName, 'uploads/products');
};

// Category image URL utility
export const getCategoryImageUrl = (imageName) => {
  return getImageUrl(imageName, 'uploads/categories');
};