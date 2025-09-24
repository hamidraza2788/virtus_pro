# Loader Component System

This document explains how to use the comprehensive loader system implemented in the Virtus Pro app.

## Components Overview

### 1. Loader Component (`src/components/Loader.tsx`)
A reusable spinner component with customizable options.

**Props:**
- `visible: boolean` - Controls loader visibility
- `message?: string` - Custom loading message (default: "Loading...")
- `overlay?: boolean` - Whether to show as modal overlay (default: true)
- `size?: 'small' | 'large'` - Spinner size (default: 'large')
- `color?: string` - Spinner color (default: Colors.primary)
- `backgroundColor?: string` - Overlay background color
- `textColor?: string` - Text color

**Usage:**
```tsx
<Loader 
  visible={isLoading} 
  message="Processing..." 
  overlay={true}
/>
```

### 2. useLoading Hook (`src/hooks/useLoading.ts`)
Local loading state management hook.

**Returns:**
- `isLoading: boolean` - Loading state
- `message: string` - Current loading message
- `startLoading(message?: string)` - Start loading with optional message
- `stopLoading()` - Stop loading
- `setLoadingMessage(message: string)` - Update loading message

**Usage:**
```tsx
const { isLoading, message, startLoading, stopLoading } = useLoading();

const handleApiCall = async () => {
  startLoading('Processing...');
  try {
    await apiCall();
  } finally {
    stopLoading();
  }
};
```

### 3. Global Loader Context (`src/contexts/LoaderContext.tsx`)
Global loading state management using React Context.

**Usage:**
```tsx
const { showLoader, hideLoader, setLoaderMessage } = useGlobalLoader();

const handleApiCall = async () => {
  showLoader('Processing...');
  try {
    await apiCall();
  } finally {
    hideLoader();
  }
};
```

### 4. useApiWithLoader Hook (`src/hooks/useApiWithLoader.ts`)
Higher-order hook that automatically handles loading states for API calls.

**Usage:**
```tsx
const { executeApiCall } = useApiWithLoader();

const handleApiCall = async () => {
  try {
    const result = await executeApiCall(
      () => apiCall(),
      {
        loadingMessage: 'Processing...',
        successMessage: 'Success!',
        errorMessage: 'Failed to process'
      }
    );
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Implementation Examples

### Basic Implementation (Current)
```tsx
import Loader from '../../components/Loader';
import useLoading from '../../hooks/useLoading';

const MyScreen = () => {
  const { isLoading, message, startLoading, stopLoading } = useLoading();

  const handleApiCall = async () => {
    startLoading('Processing...');
    try {
      await apiCall();
    } catch (error) {
      // Handle error
    } finally {
      stopLoading();
    }
  };

  return (
    <View>
      {/* Your content */}
      <Loader visible={isLoading} message={message} />
    </View>
  );
};
```

### Global Loader Implementation
```tsx
import { useGlobalLoader } from '../../contexts/LoaderContext';

const MyScreen = () => {
  const { showLoader, hideLoader } = useGlobalLoader();

  const handleApiCall = async () => {
    showLoader('Processing...');
    try {
      await apiCall();
    } catch (error) {
      // Handle error
    } finally {
      hideLoader();
    }
  };

  return (
    <View>
      {/* Your content */}
      {/* GlobalLoader is rendered at app level */}
    </View>
  );
};
```

### Automatic API Loader Implementation
```tsx
import { useApiWithLoader } from '../../hooks/useApiWithLoader';

const MyScreen = () => {
  const { executeApiCall } = useApiWithLoader();

  const handleApiCall = async () => {
    try {
      const result = await executeApiCall(
        () => apiCall(),
        {
          loadingMessage: 'Processing...',
          successMessage: 'Success!',
          errorMessage: 'Failed to process'
        }
      );
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <View>
      {/* Your content */}
      {/* GlobalLoader is rendered at app level */}
    </View>
  );
};
```

## Setup Instructions

### 1. For App-Level Global Loader
Add to your main App component:

```tsx
import { LoaderProvider } from './src/contexts/LoaderContext';
import GlobalLoader from './src/components/GlobalLoader';

export default function App() {
  return (
    <LoaderProvider>
      {/* Your app content */}
      <GlobalLoader />
    </LoaderProvider>
  );
}
```

### 2. For Individual Screen Loaders
```tsx
import Loader from '../../components/Loader';
import useLoading from '../../hooks/useLoading';

// Use in your component as shown in examples above
```

## Current Implementation Status

✅ **Completed:**
- ResetPasswordScreen
- LoginScreen  
- SignupScreen
- ForgotPasswordScreen

🔄 **Ready for Implementation:**
- ProfileScreen (when API calls are added)
- HomeScreen (when API calls are added)
- CatalogScreen (when API calls are added)
- DealerScreen (when API calls are added)

## Best Practices

1. **Always use try/catch/finally** to ensure loader is hidden
2. **Provide meaningful messages** to users
3. **Use appropriate loading states** for different operations
4. **Consider using global loader** for app-wide operations
5. **Use local loader** for screen-specific operations

## Troubleshooting

### Loader not showing
- Check if `visible` prop is true
- Verify Metro bundler is running
- Check console for errors

### Loader not hiding
- Ensure `stopLoading()` is called in finally block
- Check for unhandled promise rejections
- Verify error handling is proper

### Performance issues
- Use local loader for single-screen operations
- Use global loader sparingly for app-wide operations
- Consider debouncing rapid API calls
