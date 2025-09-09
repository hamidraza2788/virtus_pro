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
  const isDarkMode = useColorScheme() === 'dark';
  const statusBarBackgroundColor = isDarkMode ? '#000000' : '#FFFFFF';

  return (
    <SafeAreaProvider>
      {Platform.OS === 'android' && (
         <StatusBar 
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />
      )}
      {Platform.OS === 'ios' && (
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      )}
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