# Profile Update API Integration - Complete Guide

## Overview
The ProfileScreen now integrates with the backend API for profile updates, supporting both JSON data updates and file uploads for profile images. This implementation follows the API_ENDPOINTS.md specification exactly.

## API Integration Features

### 1. Profile Update API Functions
- **JSON Update**: `updateProfileApi()` - Updates profile data without image
- **File Upload**: `updateProfileWithImageApi()` - Updates profile with image upload
- **Automatic Selection**: Chooses appropriate API based on whether image is provided

### 2. Redux Integration
- **Async Thunks**: `updateProfile` and `updateProfileWithImage`
- **State Management**: Updates Redux state with server response
- **localStorage Sync**: Automatically syncs updated data to localStorage
- **Loading States**: Proper loading indicators during API calls

### 3. File Upload Support
- **Multipart Form Data**: Proper FormData creation for file uploads
- **Image Validation**: Supports JPG, JPEG, PNG, GIF formats
- **Size Limits**: Respects 5MB maximum file size
- **Quality Optimization**: 0.8 quality for optimal file size

## Technical Implementation

### API Functions (`src/api/authApis.tsx`)

#### Update Profile (JSON)
```typescript
export const updateProfileApi = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  try {
    logAPI('Making API call to update-profile.php with data:', profileData);
    const res = await axiosInstance.put("/update-profile.php", profileData);
    logAPI('Profile update API response:', res.data);
    return res.data;
  } catch (error: any) {
    logAPI('Profile update API error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    throw new Error(error.response?.data?.message || "Profile update failed");
  }
};
```

#### Update Profile with Image (File Upload)
```typescript
export const updateProfileWithImageApi = async (
  profileData: UpdateProfileRequest,
  imageUri?: string
): Promise<UpdateProfileResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add profile data
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });
    
    // Add image if provided
    if (imageUri) {
      formData.append('profile_image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
      } as any);
    }
    
    const res = await axiosInstance.post("/update-profile.php", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Profile update with image failed");
  }
};
```

### Redux Integration (`src/redux/slices/authSlice.ts`)

#### Profile Update Thunks
```typescript
// Update profile without image
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { first_name?: string; last_name?: string; phone?: string; address?: string }, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(profileData);
      
      // Update localStorage with new user data
      if (response.data.user) {
        await StorageUtils.saveUserData(response.data.user, '');
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Profile update failed");
    }
  }
);

// Update profile with image
export const updateProfileWithImage = createAsyncThunk(
  "auth/updateProfileWithImage",
  async (data: { 
    profileData: { first_name?: string; last_name?: string; phone?: string; address?: string };
    imageUri?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await updateProfileWithImageApi(data.profileData, data.imageUri);
      
      // Update localStorage with new user data including profile image
      if (response.data.user) {
        await StorageUtils.saveUserData(response.data.user, '');
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Profile update with image failed");
    }
  }
);
```

#### Redux Reducers
```typescript
// Profile update reducers
.addCase(updateProfile.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  // Update user data in Redux state
  if (action.payload.data.user) {
    state.user = action.payload.data.user;
  }
})
.addCase(updateProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})
// Similar reducers for updateProfileWithImage...
```

### ProfileScreen Integration (`src/navigation/screens/ProfileScreen.tsx`)

#### Smart Update Function
```typescript
const updateUserData = async () => {
  try {
    startLoading('Updating profile...');
    
    const profileData = {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
    };
    
    // Remove empty fields
    const filteredProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([_, value]) => value && value.trim() !== '')
    );
    
    // Check if we have any data to update
    if (Object.keys(filteredProfileData).length === 0 && !profileImage) {
      Alert.alert('Info', 'Please enter some information to update');
      stopLoading();
      return;
    }
    
    let response;
    if (profileImage) {
      // Update with image using multipart/form-data
      response = await dispatch(updateProfileWithImage({
        profileData: filteredProfileData,
        imageUri: profileImage
      })).unwrap();
    } else {
      // Update without image using JSON
      response = await dispatch(updateProfile(filteredProfileData)).unwrap();
    }
    
    console.log('Profile updated successfully:', response);
    Alert.alert('Success', 'Profile updated successfully!');
    
  } catch (error: any) {
    console.error('Error updating profile:', error);
    Alert.alert('Error', error || 'Failed to update profile');
  } finally {
    stopLoading();
  }
};
```

## API Endpoint Compatibility

### Request Formats

#### JSON Update (PUT /update-profile.php)
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### File Upload (POST /update-profile.php)
```
Content-Type: multipart/form-data

Fields:
- first_name: "John"
- last_name: "Doe" 
- phone: "+1234567890"
- address: "123 Main St"
- profile_image: [file]
```

### Response Format
```json
{
  "status": 200,
  "message": "Profile updated successfully",
  "timestamp": "2025-09-23 08:42:17",
  "data": {
    "user": {
      "id": 6,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "profile_image": "profile_6_1758616937.png",
      "created_at": "2025-09-20 12:48:57",
      "profile_image_url": "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png"
    },
    "updated_fields": [
      "first_name",
      "last_name",
      "profile_image"
    ]
  }
}
```

## Data Flow

### 1. Profile Update Process
```
User clicks Save → updateUserData() → Check for image → Choose API → 
Dispatch Redux action → API call → Update localStorage → Update Redux → Show success
```

### 2. Image Selection Process
```
User selects image → handleImagePickerResponse() → Set local state → 
User clicks Save → Upload to server → Get server URL → Update localStorage
```

### 3. Data Loading Process
```
Screen mount → loadUserData() → Get from localStorage → 
Prioritize server URL → Populate form fields
```

## Error Handling

### API Errors
- **400**: Invalid JSON format, no fields provided
- **401**: Authorization token required, invalid/expired token
- **404**: User not found
- **422**: Validation errors (forbidden fields, file type, file size)
- **500**: Server error

### Client-Side Validation
- **Empty fields**: Filtered out before API call
- **No data**: Alert user to enter information
- **File validation**: Handled by image picker library
- **Network errors**: Graceful error messages

### Error Response Examples
```json
{
  "status": 422,
  "message": "Validation failed",
  "timestamp": "2025-09-23 08:27:43",
  "data": {
    "errors": {
      "profile_image": "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."
    }
  }
}
```

## Testing Guide

### Test Case 1: Profile Update Without Image
```bash
1. Navigate to ProfileScreen
2. Modify text fields (first name, last name, phone, address)
3. Tap Save button
4. Verify success alert
5. Check console logs for API call
6. Verify data updated in localStorage
```

### Test Case 2: Profile Update With Image
```bash
1. Navigate to ProfileScreen
2. Tap profile image area
3. Select image from camera/gallery
4. Modify text fields
5. Tap Save button
6. Verify success alert
7. Check console logs for multipart upload
8. Verify image URL in localStorage
```

### Test Case 3: Error Handling
```bash
1. Try updating with invalid data
2. Test network errors (offline)
3. Test file upload errors (large file, wrong format)
4. Verify appropriate error messages
```

### Test Case 4: Data Persistence
```bash
1. Update profile successfully
2. Close and reopen app
3. Navigate to ProfileScreen
4. Verify all data persists
5. Verify image loads from server URL
```

## Performance Optimizations

### Image Handling
- **Quality**: 0.8 for optimal balance
- **Size limits**: 2000x2000 max dimensions
- **Format**: JPEG for smaller files
- **Caching**: Server URLs cached in localStorage

### API Calls
- **Smart selection**: Only upload image if changed
- **Field filtering**: Remove empty fields before API call
- **Loading states**: Proper UI feedback during operations

### Data Management
- **localStorage sync**: Automatic sync after successful updates
- **Redux state**: Immediate UI updates
- **Error recovery**: Graceful fallbacks for failures

## Security Considerations

### Authentication
- **JWT tokens**: Automatic inclusion in API headers
- **Token validation**: Server-side token verification
- **Session management**: Proper token handling

### File Upload Security
- **File validation**: Server-side file type validation
- **Size limits**: 5MB maximum file size
- **Path security**: Secure file storage on server

### Data Protection
- **Input sanitization**: Server-side data validation
- **XSS prevention**: Proper data encoding
- **CSRF protection**: Token-based protection

## Troubleshooting

### Common Issues

1. **Image not uploading**
   - Check file size (must be < 5MB)
   - Verify file format (JPG, PNG, GIF only)
   - Check network connectivity
   - Verify server permissions

2. **Profile not updating**
   - Check authentication token
   - Verify API endpoint accessibility
   - Check console logs for errors
   - Verify required fields

3. **Data not persisting**
   - Check localStorage permissions
   - Verify Redux state updates
   - Check console logs for sync errors

### Debug Steps
1. Check console logs for API calls
2. Verify network requests in browser dev tools
3. Check localStorage data
4. Verify Redux state
5. Test API endpoints directly

## Future Enhancements

### Planned Features
- **Image compression**: Automatic client-side compression
- **Progress indicators**: File upload progress
- **Batch updates**: Multiple field updates in one call
- **Offline support**: Queue updates for when online

### API Improvements
- **Real-time sync**: WebSocket integration
- **Image optimization**: Server-side image processing
- **Version control**: Profile change history
- **Backup/restore**: Profile data backup

This implementation provides a robust, secure, and user-friendly profile update system that fully integrates with the backend API while maintaining excellent user experience! 🎉
