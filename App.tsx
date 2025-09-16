import React from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  Platform,
  View 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Navigation } from './src/navigation';

import { enableScreens } from 'react-native-screens';
import { store } from './src/redux/store';
import LanguageSync from './src/components/LanguageSync';
import './src/i18n'; // Initialize i18n

enableScreens();

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <LanguageSync />
        <StatusBar 
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={Platform.OS === 'android'}
        />
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;