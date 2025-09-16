import React from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  Platform,
  View 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';
import { enableScreens } from 'react-native-screens';

enableScreens();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <Navigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;