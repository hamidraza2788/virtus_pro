import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import authSlice from './slices/authSlice';
import languageSlice from './slices/languageSlice';
import catalogSlice from './slices/catalogSlice';
import productsSlice from './slices/productsSlice';
import productDetailSlice from './slices/productDetailSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Root key for storage
  storage: AsyncStorage, // Use AsyncStorage as storage
  whitelist: ['auth', 'language'], // Persist auth and language state
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  language: languageSlice,
  catalog: catalogSlice,
  products: productsSlice,
  productDetail: productDetailSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization issues with redux-persist
    }),
});

// Persistor instance
export const persistor = persistStore(store);

// Define types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
