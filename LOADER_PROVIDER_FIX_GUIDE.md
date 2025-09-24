# LoaderProvider Fix Guide

## Problem
The `ResetPasswordScreen` was showing a "Render Error" with the message:
```
useGlobalLoader must be used within a LoaderProvider
```

## Root Cause
The `useGlobalLoader` hook was being used in `ResetPasswordScreen.tsx` (and potentially other components) but there was no `LoaderProvider` wrapping the app in `App.tsx`. React Context hooks require their corresponding Provider to be present in the component tree.

## Solution
Added the `LoaderProvider` to the app's root component structure in `App.tsx` to make the global loader context available throughout the app.

## Files Updated

### 1. **`App.tsx`**

#### Changes Made:
- **Added LoaderProvider import**
- **Added GlobalLoader import**
- **Wrapped app with LoaderProvider**
- **Added GlobalLoader component**

#### Before:
```typescript
import { Navigation } from './src/navigation';
import { enableScreens } from 'react-native-screens';
import { store } from './src/redux/store';
import LanguageSync from './src/components/LanguageSync';
import './src/i18n';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <LanguageSync />
        <StatusBar />
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
}
```

#### After:
```typescript
import { Navigation } from './src/navigation';
import { enableScreens } from 'react-native-screens';
import { store } from './src/redux/store';
import LanguageSync from './src/components/LanguageSync';
import { LoaderProvider } from './src/contexts/LoaderContext';
import GlobalLoader from './src/components/GlobalLoader';
import './src/i18n';

function App() {
  return (
    <Provider store={store}>
      <LoaderProvider>
        <SafeAreaProvider>
          <LanguageSync />
          <StatusBar />
          <Navigation />
          <GlobalLoader />
        </SafeAreaProvider>
      </LoaderProvider>
    </Provider>
  );
}
```

## Component Structure

### Provider Hierarchy:
```
App
├── Provider (Redux)
└── LoaderProvider (Global Loader Context)
    └── SafeAreaProvider
        ├── LanguageSync
        ├── StatusBar
        ├── Navigation
        └── GlobalLoader (Global Loader Component)
```

### Context Flow:
1. **LoaderProvider** provides the global loader context
2. **GlobalLoader** component renders the global loader when active
3. **useGlobalLoader** hook can be used in any component within the provider tree
4. **Local loaders** can still be used independently

## Loader System Architecture

### 1. **Global Loader System**
- **LoaderProvider**: Provides global loader context
- **useGlobalLoader**: Hook to control global loader
- **GlobalLoader**: Component that renders the global loader
- **useApiWithLoader**: HOC for automatic API loading

### 2. **Local Loader System**
- **useLoading**: Hook for local loading state
- **Loader**: Component for local loader display
- **Individual component control**: Each component manages its own loader

### 3. **Usage Patterns**

#### Global Loader Usage:
```typescript
import { useGlobalLoader } from '../../contexts/LoaderContext';

const MyComponent = () => {
  const { showLoader, hideLoader } = useGlobalLoader();
  
  const handleAction = async () => {
    showLoader('Processing...');
    try {
      await someApiCall();
    } finally {
      hideLoader();
    }
  };
};
```

#### Local Loader Usage:
```typescript
import useLoading from '../../hooks/useLoading';
import Loader from '../../components/Loader';

const MyComponent = () => {
  const { isLoading, message, startLoading, stopLoading } = useLoading();
  
  const handleAction = async () => {
    startLoading('Processing...');
    try {
      await someApiCall();
    } finally {
      stopLoading();
    }
  };
  
  return (
    <View>
      {/* Component content */}
      <Loader visible={isLoading} message={message} />
    </View>
  );
};
```

## Components Using Global Loader

### 1. **ResetPasswordScreen.tsx**
- **Uses**: `useGlobalLoader` for password reset operations
- **Benefit**: Global loader provides consistent UX across the app

### 2. **useApiWithLoader.ts**
- **Uses**: `useGlobalLoader` for automatic API loading
- **Benefit**: HOC pattern for consistent API loading behavior

### 3. **GlobalLoader.tsx**
- **Uses**: `useGlobalLoader` to render the global loader
- **Benefit**: Single global loader component for the entire app

## Benefits of This Fix

### 1. **Consistent User Experience**
- **Global loader**: Provides consistent loading experience across the app
- **Local loaders**: Allow fine-grained control for specific components
- **Flexible usage**: Developers can choose between global and local loaders

### 2. **Better Error Handling**
- **Context validation**: Proper error messages when Provider is missing
- **Type safety**: TypeScript ensures proper usage of loader context
- **Debugging**: Clear error messages help identify missing providers

### 3. **Improved Architecture**
- **Separation of concerns**: Global vs local loader responsibilities
- **Reusability**: Global loader can be used across multiple components
- **Maintainability**: Centralized loader management

## Testing Scenarios

### 1. **ResetPasswordScreen Navigation**
```bash
✅ Navigate to ResetPasswordScreen → No error
✅ Use global loader → Works correctly
✅ Use local loader → Works correctly
✅ Both loaders → Can be used together
```

### 2. **Global Loader Functionality**
```bash
✅ showLoader() → Global loader appears
✅ hideLoader() → Global loader disappears
✅ setLoaderMessage() → Message updates
✅ Multiple components → Can control global loader
```

### 3. **Error Scenarios**
```bash
✅ Missing LoaderProvider → Clear error message
✅ useGlobalLoader outside provider → Proper error
✅ Context validation → TypeScript errors
```

## Performance Considerations

### 1. **Context Performance**
- **Minimal re-renders**: Context only updates when loader state changes
- **Efficient updates**: Only components using the context re-render
- **Memory usage**: Low overhead for global loader context

### 2. **Loader Rendering**
- **Global loader**: Renders once at app level
- **Local loaders**: Render per component as needed
- **Overlay management**: Proper z-index and positioning

## Future Enhancements

### 1. **Loader Customization**
- **Themes**: Different loader styles for different contexts
- **Animations**: Custom loading animations
- **Progress bars**: Progress indication for long operations

### 2. **Advanced Features**
- **Queue management**: Multiple loader requests
- **Priority system**: Different loader priorities
- **Timeout handling**: Automatic loader timeout

## Troubleshooting

### Common Issues:

1. **"useGlobalLoader must be used within a LoaderProvider"**
   - **Cause**: Component using `useGlobalLoader` is not wrapped by `LoaderProvider`
   - **Fix**: Ensure `LoaderProvider` is in the component tree above the component

2. **Global loader not showing**
   - **Cause**: `GlobalLoader` component not rendered
   - **Fix**: Add `<GlobalLoader />` to the app structure

3. **Multiple loaders showing**
   - **Cause**: Both global and local loaders active simultaneously
   - **Fix**: Use either global or local loader, not both

### Debug Steps:
1. Check if `LoaderProvider` is wrapping the app
2. Verify `GlobalLoader` component is rendered
3. Check console for context errors
4. Ensure proper import statements

## Quick Reference

### Setup:
```typescript
// App.tsx
import { LoaderProvider } from './src/contexts/LoaderContext';
import GlobalLoader from './src/components/GlobalLoader';

<LoaderProvider>
  <App />
  <GlobalLoader />
</LoaderProvider>
```

### Usage:
```typescript
// In any component
import { useGlobalLoader } from '../contexts/LoaderContext';

const { showLoader, hideLoader } = useGlobalLoader();
```

### Files:
- **`App.tsx`** - Provider setup
- **`LoaderContext.tsx`** - Context definition
- **`GlobalLoader.tsx`** - Global loader component
- **`useApiWithLoader.ts`** - API loader HOC
- **`ResetPasswordScreen.tsx`** - Example usage

This fix ensures that the global loader system works correctly throughout the app while maintaining the flexibility of local loaders for specific use cases! 🎉
