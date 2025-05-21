import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { Image } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Navigation/AuthContext';
import { userLogout } from '../API_STORE/user_api';
import SvgIcons from '../assets/styles/SvgIcons';
import { colorPalette } from '../assets/styles/Colors';

const ProfileScreen = () => {
  const { setAuthUser, authUser } = useAuth();
  const navigation = useNavigation();

  const handleUserDetails = () => {
    navigation.navigate('UserDetails');
  };

  const handleSignOut = async () => {
    try {
      const result = await userLogout();

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Logged out successfully!',
        });

        setAuthUser(null);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Logout Failed',
          text2: result.error || 'Something went wrong.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred',
        text2: 'Please try again later.',
      });
    }
  };

  const handlePrivacyPolicy = () => {
    // Navigate to Privacy Policy screen
    // navigation.navigate('PrivacyPolicy');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: '🎉 Hey there! Discover the amazing world of learning with the Nexgen App! 🌟 Fun games, cool lessons & endless adventures await! 🚀📚 Download now: https://example.com/app',
      });
    } catch (error) {
      Alert.alert('Error', 'Oops! Something went wrong while sharing the fun.');
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.profileLogoContainer}>
        <Image source={require('../assets/images/NexGenImage.png')} style={styles.logo} />
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity onPress={handleUserDetails}>
          <View style={[styles.optionRow, { flexDirection: 'column' }]}>
            {SvgIcons.profileLarge}
            <Text style={[styles.optionText]}>{authUser ? `${authUser.username}  ` : "User Details"}
              {SvgIcons.edit_Icons}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleSignOut}>
          <View style={styles.optionRow}>
            {SvgIcons.sign_out}
            <Text style={styles.optionText}>Sign Out</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handlePrivacyPolicy}>
          <View style={styles.optionRow}>
            {SvgIcons.privacy_policy}
            <Text style={styles.optionText}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShareApp}>
          <View style={styles.optionRow}>
            {SvgIcons.share}
            <Text style={styles.optionText}>Share Nexgen App</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Version 1.0.1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.aliceBlue,
    padding: 20
  },
  profileLogoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
  },
  optionsContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 }, // Adds shadow on iOS
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  optionText: {
    fontSize: 16,
  },
  optionButton: {
    marginBottom: 25,
  },
  versionText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;
