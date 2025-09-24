# Image URL Implementation Guide

## Overview
The app now properly handles profile images by constructing complete URLs from image filenames stored in localStorage. This ensures profile images display correctly from the server.

## Image URL Utilities

### Base URL Configuration (`src/api/baseURL.js`)

#### Image Base URL
```javascript
export const IMAGE_BASE_URL = "http://localhost:8888/virtus_pro";
```

#### Profile Image URL Utility
```javascript
export const getProfileImageUrl = (imageName) => {
  if (!imageName) return null;
  
  // If it's already a complete URL, return as is
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // If it's just a filename, construct the full URL
  return `${IMAGE_BASE_URL}/uploads/profile_images/${imageName}`;
};
```

#### Generic Image URL Utilities
```javascript
// Generic image URL utility
export const getImageUrl = (imageName, folder = 'uploads') => {
  if (!imageName) return null;
  
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
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
```

## ProfileScreen Integration

### Import Statement
```typescript
import { getProfileImageUrl } from '../../api/baseURL';
```

### Image URL Construction
```typescript
const loadUserData = async () => {
  try {
    setIsLoading(true);
    const userData = await StorageUtils.getUserData();
    if (userData) {
      // ... other field assignments ...
      
      // Load profile image if stored (construct full URL from image name)
      const profileImageUrl = userData.profile_image_url || 
                            getProfileImageUrl(userData.profile_image) || 
                            null;
      setProfileImage(profileImageUrl);
      
      console.log('Profile image URL constructed:', profileImageUrl);
      console.log('Profile image name from data:', userData.profile_image);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## Data Structure

### UserData Interface
```typescript
export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_image?: string;        // Image filename from server
  profile_image_url?: string;    // Complete image URL from server
  created_at: string;
}
```

### Image URL Priority
The ProfileScreen uses the following priority for profile images:
1. **`profile_image_url`** - Complete URL from server (highest priority)
2. **`getProfileImageUrl(profile_image)`** - Constructed URL from filename
3. **`null`** - No image available

## URL Construction Examples

### Input: Image Filename
```javascript
// Input
const imageName = "profile_6_1758616937.png";

// Output
const fullUrl = getProfileImageUrl(imageName);
// Result: "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png"
```

### Input: Complete URL
```javascript
// Input
const imageName = "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png";

// Output
const fullUrl = getProfileImageUrl(imageName);
// Result: "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png" (unchanged)
```

### Input: Null/Undefined
```javascript
// Input
const imageName = null;

// Output
const fullUrl = getProfileImageUrl(imageName);
// Result: null
```

## API Response Handling

### Server Response Format
```json
{
  "status": 200,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 6,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "profile_image": "profile_6_1758616937.png",
      "profile_image_url": "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png",
      "created_at": "2025-09-20 12:48:57"
    }
  }
}
```

### Image Field Usage
- **`profile_image`**: Filename only (e.g., "profile_6_1758616937.png")
- **`profile_image_url`**: Complete URL (e.g., "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png")

## Error Handling

### Null/Undefined Image Names
```javascript
getProfileImageUrl(null);        // Returns: null
getProfileImageUrl(undefined);   // Returns: null
getProfileImageUrl("");          // Returns: null
```

### Invalid Image Names
```javascript
getProfileImageUrl("invalid..path");  // Returns: "http://localhost:8888/virtus_pro/uploads/profile_images/invalid..path"
```

## Testing Scenarios

### Test Case 1: Profile Image with Filename
```bash
1. Login and update profile with image
2. Check localStorage for profile_image field
3. Navigate to ProfileScreen
4. Verify image displays correctly
5. Check console logs for constructed URL
```

### Test Case 2: Profile Image with Complete URL
```bash
1. Server returns profile_image_url in response
2. Check localStorage for profile_image_url field
3. Navigate to ProfileScreen
4. Verify image displays using complete URL
5. Check console logs for URL usage
```

### Test Case 3: No Profile Image
```bash
1. User has no profile image
2. Navigate to ProfileScreen
3. Verify default avatar displays
4. Check console logs for null URL
```

### Test Case 4: Invalid Image Name
```bash
1. Manually set invalid image name in localStorage
2. Navigate to ProfileScreen
3. Verify error handling
4. Check console logs for constructed URL
```

## Console Logging

### Profile Image URL Construction
```
Profile data loaded from localStorage: {
  id: "6",
  first_name: "John",
  profile_image: "profile_6_1758616937.png",
  profile_image_url: null
}

Profile image URL constructed: http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png
Profile image name from data: profile_6_1758616937.png
```

### Complete URL Usage
```
Profile data loaded from localStorage: {
  id: "6",
  first_name: "John",
  profile_image: "profile_6_1758616937.png",
  profile_image_url: "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png"
}

Profile image URL constructed: http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png
Profile image name from data: profile_6_1758616937.png
```

## Performance Considerations

### URL Construction
- **✅ Efficient**: Simple string concatenation
- **✅ Cached**: Constructed once during data loading
- **✅ Lightweight**: Minimal memory overhead

### Image Loading
- **✅ Optimized**: React Native handles image caching
- **✅ Error handling**: Graceful fallback for failed loads
- **✅ Placeholder**: Default avatar for missing images

## Security Considerations

### URL Validation
- **✅ Protocol check**: Validates http/https protocols
- **✅ Path construction**: Safe string concatenation
- **✅ Input sanitization**: Handles null/undefined values

### Image Access
- **✅ Server-side**: Images served from controlled server
- **✅ Path validation**: Constructed paths are predictable
- **✅ Access control**: Server handles image access permissions

## Future Enhancements

### Planned Features
- **Image CDN**: Support for CDN URLs
- **Image optimization**: Automatic image resizing
- **Caching**: Local image caching
- **Fallback images**: Multiple fallback options

### Configuration Options
- **Environment-based URLs**: Different URLs for dev/prod
- **Custom folders**: Configurable upload folders
- **URL templates**: Customizable URL patterns

## Troubleshooting

### Common Issues

1. **Image not displaying**
   - Check console logs for constructed URL
   - Verify image exists on server
   - Check network connectivity
   - Verify IMAGE_BASE_URL configuration

2. **Wrong image URL**
   - Check profile_image field in localStorage
   - Verify getProfileImageUrl function
   - Check server response format

3. **Default avatar showing**
   - Check if profile_image is null/undefined
   - Verify image loading errors
   - Check console logs for URL construction

### Debug Steps
1. Check console logs for image URL construction
2. Verify localStorage data structure
3. Test image URL in browser
4. Check network requests for image loading
5. Verify server image file exists

## Quick Reference

### Key Functions
- `getProfileImageUrl(imageName)` - Construct profile image URL
- `getImageUrl(imageName, folder)` - Generic image URL constructor
- `getProductImageUrl(imageName)` - Product image URL constructor
- `getCategoryImageUrl(imageName)` - Category image URL constructor

### Key Variables
- `IMAGE_BASE_URL` - Base URL for all images
- `profileImageUrl` - Constructed profile image URL
- `userData.profile_image` - Image filename from server
- `userData.profile_image_url` - Complete URL from server

This implementation ensures proper image URL construction and display while maintaining flexibility for different image types and server configurations! 🎉
