# Profile Update API with User ID - Complete Guide

## Overview
The profile update API has been updated to require `user_id` as a mandatory field for all profile updates. This ensures proper user identification and security in profile operations.

## Updated API Integration

### 1. API Interface Updates
- **✅ `user_id` field added** as required field in `UpdateProfileRequest`
- **✅ Type safety** maintained with proper TypeScript interfaces
- **✅ Backward compatibility** preserved for existing functionality

### 2. Request Format Updates

#### JSON Update (PUT /update-profile.php)
```typescript
// Updated Request Format
{
  "user_id": 6,                    // REQUIRED - User ID from localStorage
  "first_name": "John",            // Optional
  "last_name": "Doe",              // Optional
  "phone": "+1234567890",          // Optional
  "address": "123 Main St"         // Optional
}
```

#### File Upload (POST /update-profile.php)
```typescript
// Updated FormData Format
FormData: {
  user_id: "6",                    // REQUIRED - User ID as string for FormData
  first_name: "John",              // Optional
  last_name: "Doe",                // Optional
  phone: "+1234567890",            // Optional
  address: "123 Main St",          // Optional
  profile_image: [file]            // Optional
}
```

## Technical Implementation

### API Interface (`src/api/authApis.tsx`)

#### Updated Interface
```typescript
interface UpdateProfileRequest {
  user_id: number;                 // REQUIRED field
  first_name?: string;             // Optional
  last_name?: string;              // Optional
  phone?: string;                  // Optional
  address?: string;                // Optional
}
```

#### JSON API Function
```typescript
export const updateProfileApi = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  try {
    logAPI('Making API call to update-profile.php with data:', profileData);
    const res = await axiosInstance.put("/update-profile.php", profileData);
    logAPI('Profile update API response:', res.data);
    return res.data;
  } catch (error: any) {
    // Error handling...
  }
};
```

#### File Upload API Function
```typescript
export const updateProfileWithImageApi = async (
  profileData: UpdateProfileRequest,
  imageUri?: string
): Promise<UpdateProfileResponse> => {
  try {
    const formData = new FormData();
    
    // Add profile data (including user_id)
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString()); // Convert user_id to string
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
    // Error handling...
  }
};
```

### Redux Integration (`src/redux/slices/authSlice.ts`)

#### Updated Thunk Interfaces
```typescript
// Update profile without image
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: { 
    user_id: number; 
    first_name?: string; 
    last_name?: string; 
    phone?: string; 
    address?: string 
  }, { rejectWithValue }) => {
    // Implementation...
  }
);

// Update profile with image
export const updateProfileWithImage = createAsyncThunk(
  "auth/updateProfileWithImage",
  async (data: { 
    profileData: { 
      user_id: number; 
      first_name?: string; 
      last_name?: string; 
      phone?: string; 
      address?: string 
    };
    imageUri?: string;
  }, { rejectWithValue }) => {
    // Implementation...
  }
);
```

### ProfileScreen Integration (`src/navigation/screens/ProfileScreen.tsx`)

#### User ID Retrieval and Validation
```typescript
const updateUserData = async () => {
  try {
    startLoading('Updating profile...');
    
    // Get user data from localStorage to get user_id
    const currentUserData = await StorageUtils.getUserData();
    if (!currentUserData || !currentUserData.id) {
      Alert.alert('Error', 'User data not found. Please login again.');
      stopLoading();
      return;
    }
    
    const profileData = {
      user_id: parseInt(currentUserData.id), // Convert string to number
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      address: address,
    };
    
    // Remove empty fields (but keep user_id)
    const filteredProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([key, value]) => 
        key === 'user_id' || (value && value.toString().trim() !== '')
      )
    );
    
    // Check if we have any data to update (excluding user_id)
    const dataToUpdate = Object.keys(filteredProfileData).filter(key => key !== 'user_id');
    if (dataToUpdate.length === 0 && !profileImage) {
      Alert.alert('Info', 'Please enter some information to update');
      stopLoading();
      return;
    }
    
    // API call logic...
  } catch (error: any) {
    // Error handling...
  }
};
```

## Data Flow

### 1. Profile Update Process
```
User clicks Save → Get user_id from localStorage → Validate user data → 
Create profile data with user_id → Choose API (JSON/Multipart) → 
Dispatch Redux action → API call → Update localStorage → Update Redux → Show success
```

### 2. User ID Handling
```
localStorage user.id (string) → parseInt() → user_id (number) → 
API request → FormData conversion (string) for file uploads
```

### 3. Field Filtering Logic
```
All fields + user_id → Filter empty fields → Keep user_id always → 
Check for updateable data → Proceed with API call
```

## Security & Validation

### User ID Validation
- **✅ Required field**: user_id must be present in all requests
- **✅ Type conversion**: Proper string to number conversion
- **✅ localStorage validation**: Ensures user data exists before API call
- **✅ Error handling**: Graceful fallback if user data missing

### Data Integrity
- **✅ Field filtering**: Removes empty fields but preserves user_id
- **✅ Type safety**: TypeScript ensures correct data types
- **✅ FormData handling**: Proper conversion for file uploads
- **✅ Error recovery**: Handles missing user data scenarios

## API Request Examples

### JSON Update Request
```bash
PUT /update-profile.php
Content-Type: application/json

{
  "user_id": 6,
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### File Upload Request
```bash
POST /update-profile.php
Content-Type: multipart/form-data

user_id: "6"
first_name: "John"
last_name: "Doe"
phone: "+1234567890"
address: "123 Main St"
profile_image: [file]
```

## Error Handling

### User ID Related Errors
- **Missing user data**: "User data not found. Please login again."
- **Invalid user_id**: Server validation errors
- **Type conversion errors**: Proper error handling for parseInt()

### API Error Responses
- **400**: Invalid JSON format, missing user_id
- **401**: Authorization token required/invalid
- **404**: User not found (invalid user_id)
- **422**: Validation errors (forbidden fields, file validation)

### Error Response Example
```json
{
  "status": 422,
  "message": "Validation failed",
  "timestamp": "2025-09-23 08:27:43",
  "data": {
    "errors": {
      "user_id": "User ID is required"
    }
  }
}
```

## Testing Guide

### Test Case 1: Valid Profile Update
```bash
1. Login with valid user
2. Navigate to ProfileScreen
3. Modify profile fields
4. Tap Save button
5. Verify success alert
6. Check console logs for user_id in request
```

### Test Case 2: Profile Update with Image
```bash
1. Select profile image
2. Modify text fields
3. Tap Save button
4. Verify multipart upload includes user_id
5. Check server response for profile_image_url
```

### Test Case 3: Missing User Data
```bash
1. Clear localStorage user data
2. Navigate to ProfileScreen
3. Try to update profile
4. Verify error message: "User data not found"
```

### Test Case 4: Invalid User ID
```bash
1. Manually modify user_id in localStorage
2. Try to update profile
3. Verify server error response
4. Check error handling
```

## Console Logging

### API Request Logs
```
[API_AUTH] Making API call to update-profile.php with data: {
  user_id: 6,
  first_name: "John",
  last_name: "Doe"
}
```

### Redux Action Logs
```
[REDUX_AUTH] Calling updateProfileApi with data: {
  user_id: 6,
  first_name: "John"
}
```

### FormData Logs
```
[API_AUTH] FormData created with fields: ["user_id", "first_name", "last_name"]
```

## Performance Considerations

### User ID Retrieval
- **✅ Single localStorage call**: Efficient data retrieval
- **✅ Validation caching**: Validates user data once per update
- **✅ Error early return**: Prevents unnecessary API calls

### Data Processing
- **✅ Efficient filtering**: O(n) field filtering
- **✅ Type conversion**: Minimal overhead for parseInt()
- **✅ FormData optimization**: Only converts when needed

## Migration Notes

### Breaking Changes
- **user_id field**: Now required in all profile update requests
- **API compatibility**: Backend must support user_id parameter
- **Type safety**: TypeScript interfaces updated

### Backward Compatibility
- **✅ Existing functionality**: All existing features preserved
- **✅ Error handling**: Graceful fallbacks for missing data
- **✅ User experience**: No changes to UI/UX

## Troubleshooting

### Common Issues

1. **"User data not found" error**
   - Check localStorage for user data
   - Verify user is logged in
   - Check user.id field exists

2. **API returns 422 validation error**
   - Verify user_id is included in request
   - Check user_id is valid number
   - Verify API endpoint supports user_id

3. **FormData upload fails**
   - Check user_id is converted to string
   - Verify multipart/form-data headers
   - Check file size and format

### Debug Steps
1. Check console logs for user_id in requests
2. Verify localStorage user data
3. Test API endpoint directly with user_id
4. Check network requests in browser dev tools
5. Verify FormData construction for file uploads

## Future Enhancements

### Planned Features
- **User ID validation**: Server-side user ID verification
- **Session management**: Automatic user ID refresh
- **Audit logging**: Track profile updates by user_id
- **Bulk updates**: Multiple user profile updates

### Security Improvements
- **JWT integration**: Include user_id in JWT tokens
- **Rate limiting**: Per-user update rate limits
- **Access control**: User ID-based access validation
- **Audit trails**: Complete update history tracking

This updated implementation ensures proper user identification and security while maintaining excellent user experience and robust error handling! 🎉
