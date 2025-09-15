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
  console.log("isDarkMode", isDarkMode);
  
  // For Android, we always want dark content regardless of dark mode
  const androidBarStyle = 'dark-content';
  // For iOS, follow system preference
  const iosBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      {Platform.OS === 'android' && (
        <StatusBar 
          translucent={true}
          backgroundColor="transparent"
          barStyle={androidBarStyle} 
        />
      )}
      {Platform.OS === 'ios' && (
        <StatusBar barStyle={iosBarStyle} />
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