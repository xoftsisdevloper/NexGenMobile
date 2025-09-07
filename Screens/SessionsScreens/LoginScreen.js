import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colorPalette } from '../../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { userSignIn } from '../../API_STORE/user_api';
import Svg, { Path } from 'react-native-svg';

const LoginScreen = ({ route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { setAuthUser } = route.params;
  const { role } = route.params || {};


  // Handle login
  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }

    try {
      const data = {
        usernameOrEmail: username,
        password: password,
      };

      const result = await userSignIn({ data });

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Login Successfully',
        });
        setAuthUser(result.data.user);
        if(result.data?.user?.role === 'student') {
          navigation.replace('Home');
        }
        else {
          navigation.replace('Courses');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: result.error,
          text2: 'Login failed.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  // Navigate to Register screen
  const handleSignUp = () => {
    navigation.navigate('Register', { role: role });
  };

  return (
     <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={role === 'Teacher' ? require('../../assets/images/teacher_img.jpg') : require('../../assets/images/student_img.jpg')}
          style={styles.logoImage}
        />

        {/* Username/Email Label */}
        <Text style={styles.inputLabel}>Username or Email</Text>
        <TextInput
          style={styles.formView}
          placeholder="Enter Username or Email"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password Label */}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter the Password"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showHideButton}
          >
            <Text style={styles.showHideText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.navigate('RoleLogin')} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#85db51',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoImage: {
    width: 'auto',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignContent: 'center',
  },
  formView: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'gray',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    color: 'gray',
  },
  showHideButton: {
    paddingHorizontal: 10,
  },
  showHideText: {
    color: '#85db51',
    fontWeight: 'bold',
  },
  loginButton: {
    flex: 1,
  backgroundColor: '#85db51',
  padding: 12,
  marginLeft: 10,
  borderRadius: 8,
  alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  footerText: {
    color: '#ffffff',
    fontSize: 14,
  },
  signUpText: {
    color: colorPalette.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
    buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
 backButton: {
    flex: 1,
    backgroundColor: colorPalette.transBlue,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  backButtonText: {
    color: '#85db51',
    fontWeight: 'bold',
  },

});

export default LoginScreen;
