import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './Navigation/RootNavigator'; 
import TopBar from './Components/TopBar';
import { colorPalette } from './assets/styles/Colors';

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <RootNavigator />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default App;
