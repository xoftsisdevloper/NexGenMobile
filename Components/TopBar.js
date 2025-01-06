import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native-elements';
import logo from '../assets/images/logo.png'
import Svg, { Path } from 'react-native-svg';

const TopBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.containerParent}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>NexGen</Text>
      </View>
      <View style={styles.searchContainer}>
        <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0147ab" class="bi bi-search" viewBox="0 0 16 16">
          <Path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  containerParent: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchContainer: {
    alignSelf: 'center'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0147ab',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 5,
  }
});

export default TopBar;