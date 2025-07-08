import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './Navigation/RootNavigator';
import { colorPalette } from './assets/styles/Colors';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './Navigation/AuthContext';
import SplashScreen from 'react-native-splash-screen'

const App = () => {
  
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide(); // Hide the native splash after 2s
    }, 5000);
  }, []);
  
  return (
    <AuthProvider>

      <NavigationContainer>
        <View style={styles.container}>
          <RootNavigator />
        </View>
        < Toast />
      </NavigationContainer>

    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  }
});

export default App;
