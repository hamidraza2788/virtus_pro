# Authentication Flow with localStorage - Complete Guide

## Overview
The app now uses localStorage (AsyncStorage) for persistent authentication instead of relying solely on Redux Persist. This provides better control over authentication state and data persistence.

## Architecture

### 1. Storage Layer (`src/utils/storage.ts`)
- **StorageUtils**: Comprehensive localStorage management
- **Functions**:
  - `saveAuthData()`: Save complete authentication data
  - `getAuthData()`: Retrieve complete authentication data
  - `clearAuthData()`: Clear all authentication data
  - `isUserAuthenticated()`: Quick authentication check
  - Individual functions for user data, tokens, etc.

### 2. Auth Initializer (`src/utils/authInitializer.ts`)
- **initializeAuth()**: Sync localStorage with Redux on app start
- **isAuthenticated()**: Quick authentication check
- **getCurrentUser()**: Get current user data
- **getCurrentToken()**: Get current access token

### 3. Redux Integration
- **Login/Register**: Automatically saves to localStorage
- **Logout**: Clears both Redux and localStorage
- **clearAuth**: Manual logout that clears both

## Authentication Flow

### App Launch (SplashScreen)
1. **Initialize**: Load auth data from localStorage
2. **Sync**: Sync with Redux state
3. **Check**: Verify authentication status
4. **Navigate**:
   - ✅ **Authenticated** → HomeTabs
   - ❌ **Not Authenticated** → WelcomeScreen

### Login Flow
1. **API Call**: Login user via API
2. **Save Data**: Store user data + token in localStorage
3. **Update Redux**: Update Redux state
4. **Navigate**: Go to HomeTabs

### Logout Flow
1. **Clear localStorage**: Remove all auth data
2. **Clear Redux**: Reset Redux auth state
3. **API Call**: Optional server logout
4. **Navigate**: Go to WelcomeScreen

## Key Features

### ✅ Persistent Authentication
- User stays logged in after app restart
- Data survives app updates
- Works offline (local data)

### ✅ Secure Storage
- Uses AsyncStorage (encrypted on iOS)
- Proper error handling
- Data validation

### ✅ Redux Sync
- localStorage is source of truth
- Redux state synced on app start
- Consistent state management

### ✅ Debug Information
- Console logging for all operations
- Debug panel in development mode
- Detailed error reporting

## Testing Guide

### Test Case 1: First Time User
```bash
1. Fresh app install or clear app data
2. Launch app
3. Expected: SplashScreen → WelcomeScreen
4. Debug: All auth flags should be "No"
```

### Test Case 2: Successful Login
```bash
1. Navigate to LoginScreen
2. Enter valid credentials
3. Press Login button
4. Expected: Login → HomeTabs
5. Debug: Check localStorage has user data
```

### Test Case 3: App Restart After Login
```bash
1. Complete successful login
2. Close app completely
3. Reopen app
4. Expected: SplashScreen → HomeTabs (skips login)
5. Debug: Auth flags should be "Yes"
```

### Test Case 4: Logout Functionality
```bash
1. Go to ProfileScreen
2. Press Logout button
3. Expected: ProfileScreen → WelcomeScreen
4. Debug: localStorage should be empty
5. Restart app → Should go to WelcomeScreen
```

### Test Case 5: Registration Flow
```bash
1. Navigate to SignupScreen
2. Fill registration form
3. Press Signup button
4. Expected: Signup → Alert → LoginScreen
5. Login with new credentials → Should work
```

## Debug Information

### SplashScreen Debug Panel (Development Only)
Shows real-time authentication status:
- **Authenticated**: Yes/No
- **Has Token**: Yes/No  
- **Has User Data**: Yes/No

### Console Logging
All authentication operations are logged:
```
[SplashScreen] Starting authentication check...
[StorageUtils] User data retrieved from localStorage
[SplashScreen] Auth status check: { isAuthenticated: true, hasToken: true, hasUserData: true }
[SplashScreen] User is authenticated, navigating to HomeTabs
```

## Storage Structure

### localStorage Keys
- `user_data`: Complete user information
- `access_token`: Authentication token
- `refresh_token`: Refresh token (if available)
- `is_authenticated`: Boolean flag

### Data Format
```typescript
// User Data
{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

// Auth Data
{
  userData: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
```

## Error Handling

### Network Errors
- Login/Register failures don't affect localStorage
- Proper error messages shown to user
- Retry mechanisms available

### Storage Errors
- Graceful fallback to WelcomeScreen
- Console error logging
- App continues to function

### Token Validation
- Optional server-side validation
- Automatic logout on invalid tokens
- Seamless re-authentication flow

## Performance Optimizations

### Lazy Loading
- Only load auth data when needed
- Quick authentication checks
- Minimal startup time

### Caching
- localStorage acts as cache
- Reduces API calls
- Faster app startup

### Memory Management
- Proper cleanup on logout
- No memory leaks
- Efficient state management

## Security Considerations

### Data Protection
- AsyncStorage encryption (iOS)
- No sensitive data in Redux
- Secure token storage

### Session Management
- Automatic logout on token expiry
- Secure logout implementation
- Session validation

## Troubleshooting

### Common Issues

1. **User not staying logged in**
   - Check localStorage permissions
   - Verify AsyncStorage is working
   - Check console for storage errors

2. **Login not working**
   - Check API endpoint
   - Verify network connection
   - Check console for API errors

3. **Logout not working**
   - Check localStorage clearing
   - Verify Redux state reset
   - Check navigation flow

### Debug Steps
1. Check console logs
2. Verify localStorage data
3. Check Redux state
4. Test network connectivity
5. Verify navigation flow

## Future Enhancements

### Planned Features
- Token refresh mechanism
- Biometric authentication
- Multi-device sync
- Session timeout handling

### API Integration
- Server-side session validation
- Token refresh endpoints
- Logout from all devices
- Account security features

---

## Quick Reference

### Main Files
- `src/utils/storage.ts` - localStorage management
- `src/utils/authInitializer.ts` - Auth initialization
- `src/navigation/screens/SplashScreen.tsx` - Auth checking
- `src/redux/slices/authSlice.ts` - Redux integration

### Key Functions
- `StorageUtils.saveAuthData()` - Save auth data
- `StorageUtils.clearAuthData()` - Clear auth data
- `initializeAuth()` - Initialize on app start
- `logoutUser()` - Complete logout

### Testing Commands
```bash
# Check localStorage
# Use React Native Debugger or console logs

# Clear app data for testing
# iOS: Delete app and reinstall
# Android: Clear app data in settings
```

This authentication system provides a robust, secure, and user-friendly experience with proper data persistence and state management.
