# HomeHeader Profile Integration Guide

## Overview
The HomeHeader component now displays the user's profile image and name from localStorage, creating a personalized header experience. The component automatically loads user data and handles fallbacks gracefully.

## Features Implemented

### 1. User Profile Display
- **✅ Profile Image**: Shows user's profile image from server or default avatar
- **✅ User Name**: Displays full name (first_name + last_name) or email as fallback
- **✅ User Location**: Shows user's address or "No location set" fallback
- **✅ Error Handling**: Graceful fallback for failed image loads

### 2. Data Loading
- **✅ localStorage Integration**: Loads user data from localStorage on component mount
- **✅ Image URL Construction**: Uses profile image URL utility for complete URLs
- **✅ Real-time Updates**: Reflects changes when user data is updated

## Technical Implementation

### Component Structure
```typescript
const HomeHeader = () => {
  const { t } = useTranslation();
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userLocation, setUserLocation] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, []);

  // Component render logic...
};
```

### User Data Loading
```typescript
const loadUserData = async () => {
  try {
    const userData = await StorageUtils.getUserData();
    if (userData) {
      // Set user name
      const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      setUserName(fullName || userData.email || 'User');
      
      // Set user location
      setUserLocation(userData.address || 'No location set');
      
      // Set profile image
      const profileImageUrl = userData.profile_image_url || 
                            getProfileImageUrl(userData.profile_image) || 
                            null;
      setUserProfileImage(profileImageUrl);
      
      console.log('HomeHeader: User data loaded:', {
        name: fullName,
        location: userData.address,
        profileImage: profileImageUrl
      });
    }
  } catch (error) {
    console.error('HomeHeader: Error loading user data:', error);
  }
};
```

### Profile Image Display
```typescript
{userProfileImage ? (
  <Image 
    source={{ uri: userProfileImage }} 
    style={styles.avatar}
    onError={() => {
      console.log('HomeHeader: Profile image failed to load, using default avatar');
      setUserProfileImage(null);
    }}
  />
) : (
  <Image source={Images.avatarIcon} style={styles.avatar} />
)}
```

### User Name Display
```typescript
<View style={styles.locationContainer}>
  {userName ? (
    <Text style={styles.userName}>{userName}</Text>
  ) : (
    <Text style={styles.userName}>Welcome!</Text>
  )}
  <Text style={styles.location}>{userLocation}</Text>
</View>
```

## UI Layout

### Header Structure
```
[Profile Image] [User Name + Location] [Language Dropdown + Bell Icon]
```

### Profile Image
- **Size**: 44x44 pixels
- **Shape**: Circular (borderRadius: 22)
- **Fallback**: Default avatar icon if no profile image
- **Error Handling**: Falls back to default avatar on load error

### User Name
- **Font**: Bold, 16px
- **Color**: Black
- **Fallback**: "Welcome!" if no name available
- **Priority**: Full name > Email > "User"

### User Location
- **Font**: Medium, 13px
- **Color**: Secondary color
- **Fallback**: "No location set" if no address
- **Content**: User's address from profile

## Data Priority

### User Name Priority
1. **Full Name**: `first_name + last_name` (trimmed)
2. **Email**: User's email address
3. **Default**: "User"

### Profile Image Priority
1. **Complete URL**: `profile_image_url` from server
2. **Constructed URL**: `getProfileImageUrl(profile_image)`
3. **Default Avatar**: Default avatar icon

### Location Priority
1. **User Address**: `address` from user data
2. **Default**: "No location set"

## Styling

### Profile Image Styles
```typescript
avatar: { 
  width: 44, 
  height: 44, 
  borderRadius: 22 
}
```

### User Name Styles
```typescript
userName: { 
  color: Colors.Black, 
  fontWeight: 'bold', 
  fontSize: 16,
  marginBottom: 2
}
```

### Location Styles
```typescript
location: { 
  color: Colors.secondary, 
  fontWeight: '500', 
  fontSize: 13 
}
```

### Container Styles
```typescript
locationContainer: { 
  flex: 1, 
  marginLeft: 12 
}
```

## Error Handling

### Image Load Errors
```typescript
onError={() => {
  console.log('HomeHeader: Profile image failed to load, using default avatar');
  setUserProfileImage(null);
}}
```

### Data Loading Errors
```typescript
try {
  const userData = await StorageUtils.getUserData();
  // Process user data...
} catch (error) {
  console.error('HomeHeader: Error loading user data:', error);
}
```

### Fallback Values
- **No user data**: Shows default avatar and "Welcome!"
- **No profile image**: Shows default avatar icon
- **No name**: Shows "Welcome!" or "User"
- **No location**: Shows "No location set"

## Console Logging

### User Data Loading
```
HomeHeader: User data loaded: {
  name: "John Doe",
  location: "123 Main St, City",
  profileImage: "http://localhost:8888/virtus_pro/uploads/profile_images/profile_6_1758616937.png"
}
```

### Image Load Errors
```
HomeHeader: Profile image failed to load, using default avatar
```

### Data Loading Errors
```
HomeHeader: Error loading user data: [error details]
```

## Testing Scenarios

### Test Case 1: Complete User Profile
```bash
1. User has profile image, full name, and address
2. HomeHeader displays:
   - Profile image from server
   - Full name (first_name + last_name)
   - User's address
```

### Test Case 2: Partial User Profile
```bash
1. User has only email and no profile image
2. HomeHeader displays:
   - Default avatar icon
   - Email as name
   - "No location set"
```

### Test Case 3: No User Data
```bash
1. No user data in localStorage
2. HomeHeader displays:
   - Default avatar icon
   - "Welcome!" as name
   - "No location set"
```

### Test Case 4: Image Load Error
```bash
1. User has profile image but URL is invalid
2. HomeHeader displays:
   - Falls back to default avatar
   - User name and location still display
   - Error logged to console
```

## Performance Considerations

### Data Loading
- **✅ Single localStorage call**: Efficient data retrieval
- **✅ Component mount**: Loads data once when component mounts
- **✅ State management**: Uses local state for UI updates

### Image Loading
- **✅ React Native caching**: Automatic image caching
- **✅ Error handling**: Graceful fallback for failed loads
- **✅ Memory efficient**: Proper image component usage

### Rendering
- **✅ Conditional rendering**: Only renders when data available
- **✅ Optimized layout**: Efficient flex layout
- **✅ Minimal re-renders**: State updates only when needed

## Integration Points

### Dependencies
- **StorageUtils**: For loading user data from localStorage
- **getProfileImageUrl**: For constructing profile image URLs
- **Images**: For default avatar icon
- **Colors**: For consistent styling

### Data Sources
- **localStorage**: Primary source for user data
- **Server URLs**: For profile images
- **Default Assets**: For fallback avatar

## Future Enhancements

### Planned Features
- **Real-time Updates**: Listen for profile changes
- **Image Caching**: Local image caching
- **Animation**: Smooth transitions for profile updates
- **Click Actions**: Navigate to profile on tap

### UI Improvements
- **Profile Menu**: Dropdown with profile options
- **Status Indicators**: Online/offline status
- **Badges**: Notification badges on avatar
- **Customization**: User theme preferences

## Troubleshooting

### Common Issues

1. **Profile image not showing**
   - Check console logs for image URL construction
   - Verify image exists on server
   - Check network connectivity
   - Verify localStorage has profile_image data

2. **User name not displaying**
   - Check localStorage for user data
   - Verify first_name and last_name fields
   - Check fallback logic for email

3. **Default avatar always showing**
   - Check if profile image URL is being constructed
   - Verify image loading errors
   - Check onError callback

### Debug Steps
1. Check console logs for user data loading
2. Verify localStorage user data structure
3. Test image URL in browser
4. Check network requests for image loading
5. Verify component state updates

## Quick Reference

### Key State Variables
- `userProfileImage`: Profile image URL or null
- `userName`: User's display name
- `userLocation`: User's address

### Key Functions
- `loadUserData()`: Loads user data from localStorage
- `getProfileImageUrl()`: Constructs profile image URL

### Key Styles
- `avatar`: Profile image styling
- `userName`: User name text styling
- `location`: Location text styling

This implementation provides a personalized header experience that automatically reflects the user's profile information while maintaining excellent performance and error handling! 🎉
