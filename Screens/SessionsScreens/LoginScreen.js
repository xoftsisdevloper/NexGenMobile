import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colorPalette } from '../../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { userSignIn } from '../../API_STORE/user_api';

const LoginScreen = ({route}) => {
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
        navigation.replace('Home');
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
          source={role === 'Teacher' ? require('../../assets/images/teacher.png') : require('../../assets/images/kadiralogo.png')}
          style={styles.logoImage}
        />
        <TextInput
          style={styles.formView}
          placeholder="Username or Email"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
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
    backgroundColor: '#0147ab',
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
    color: '#0147ab',
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 15,
    backgroundColor: '#0147ab',
    paddingVertical: 12,
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
    color: colorPalette.electricBlue,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LoginScreen;
