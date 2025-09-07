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
    navigation.navigate('PrivacyPolicy');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: '🎉 Hey there! Discover the amazing world of learning with the Nexgen App! 🌟 Fun games, cool lessons & endless adventures await! 🚀📚 Download now: https://drive.google.com/drive/folders/1y1pPDUR56dc63_MQEtjMFn7FOOpNMovw?usp=sharing',
      });
    } catch (error) {
      Alert.alert('Error', 'Oops! Something went wrong while sharing the fun.');
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      {/* <View style={styles.profileLogoContainer}>
        <Image source={require('../assets/images/Nexgen.png')} style={styles.logo} />
      </View> */}

      <View style={{marginTop: 20}} >
        <TouchableOpacity onPress={handleUserDetails}>
          <View style={[styles.optionRow, { flexDirection: 'column' }]}>
            <Image source={require('../assets/images/macelogo1.png')} style={styles.logo} />
            <Text style={[styles.optionText, { fontSize: 25 }]}>{authUser ? `${authUser.username} ` : "User Details"}{SvgIcons.edit_Icons}
            </Text>

          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          {SvgIcons.role}
          <Text style={styles.optionText}>{authUser?.role || ''}</Text>
        </View>
        <View style={styles.optionRow}>
          {SvgIcons.phone}
          <Text style={styles.optionText}>{authUser?.phoneNumber || ''}</Text>
        </View>
        <View style={styles.optionRow}>
          {SvgIcons.email}
          <Text style={styles.optionText}>{authUser?.email || ''}</Text>
        </View>
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

      <Text style={styles.versionText}>Version 2.0</Text>
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
    width: 250,
    height: 120,
    borderRadius: 100,
    marginBottom: 0,
    resizeMode: 'contain',
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
    marginVertical: 10
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    rowGap: 30,
    marginVertical: 10,
    columnGap: 10
  },
  optionText: {
    fontSize: 16,
    textTransform: 'capitalize'
  },
  versionText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;
