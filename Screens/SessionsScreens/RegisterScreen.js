import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { userSignUp } from '../../API_STORE/user_api';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Navigation/AuthContext';

const RegisterScreen = ({ route }) => {
  const { setAuthUser } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolClass, setSchoolClass] = useState('');
  const [institution, setInstitution] = useState('');
  const [educationLevel, setEducationLevel] = useState(null);
  const [collegeDegree, setCollegeDegree] = useState('');
  const [customCollegeDegree, setCustomCollegeDegree] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [edlevel, setEdLevel] = useState([
    { label: 'School', value: 'school' },
    { label: 'College', value: 'college' },
    { label: 'Graduated', value: 'graduated' },
  ]);
  const [clLevels, setClLevels] = useState([
    { label: 'Class 6', value: 'class_6' },
    { label: 'Class 7', value: 'class_7' },
    { label: 'Class 8', value: 'class_8' },
    { label: 'Class 9', value: 'class_9' },
    { label: 'Class 10', value: 'class_10' },
    { label: 'Class 11', value: 'class_11' },
    { label: 'Class 12', value: 'class_12' },
  ]);
  const [cdLevels, setCdLevels] = useState([
    { label: 'BSc', value: 'bsc' },
    { label: 'BA', value: 'ba' },
    { label: 'BCA', value: 'bca' },
    { label: 'BCom', value: 'bcom' },
    { label: 'BBA', value: 'bba' },
    { label: 'BE', value: 'be' },
    { label: 'BS', value: 'bs' },
    { label: 'MSc', value: 'msc' },
    { label: 'MA', value: 'ma' },
    { label: 'MCA', value: 'mca' },
    { label: 'MCom', value: 'mcom' },
    { label: 'MBA', value: 'mba' },
    { label: 'ME', value: 'me' },
    { label: 'MS', value: 'ms' },
    { label: 'Other', value: 'other' },
  ]);

  const [educationOpen, setEducationOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [degreeOpen, setDegreeOpen] = useState(false);

  const navigation = useNavigation();
  const [showIns, setShowIns] = useState(false);
  const [showCls, setShowCls] = useState(false);
  const [showCgd, setShowCgd] = useState(false);

  const handleRegister = async () => {
    if (
      !username ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      (educationLevel === 'school' && (!institution || !schoolClass)) ||
      (educationLevel === 'college' && (!institution || !collegeDegree)) ||
      (educationLevel === 'graduated' && !collegeDegree)
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please Fill in all required fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });
      return;
    }

    try {
      const data = {
        username,
        email,
        phoneNumber,
        password,
        confirmPassword,
        isAdmin: false,
        institution,
        schoolClass,
        educationLevel,
        collegeDegree,
        customCollegeDegree: collegeDegree === 'other' ? customCollegeDegree : null,
      };

      const result = await userSignUp({ data });

      console.log('API Response:', result);

      if (result && result.success) {
        Toast.show({
          type: 'success',
          text1: 'Registered Successfully',
        });

        setAuthUser(result.data.user);
        navigation.navigate('Login');
      } else {
        Toast.show({
          type: 'error',
          text1: result?.error || 'Registration failed',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);

      Toast.show({
        type: 'error',
        text1: 'An unexpected error occurred. Please try again later.',
      });
    }
  };


  useEffect(() => {
    if (educationLevel === 'school') {
      setShowIns(true);
      setShowCls(true);
      setShowCgd(false);
    } else if (educationLevel === 'college') {
      setShowIns(true);
      setShowCls(false);
      setShowCgd(true);
    } else if (educationLevel === 'graduated') {
      setShowIns(false);
      setShowCls(false);
      setShowCgd(true);
    } else {
      setShowIns(false);
      setShowCls(false);
      setShowCgd(false);
    }
  }, [educationLevel]);

  console.log(setAuthUser);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={require('../../assets/images/NexGenImage.png')}
          style={styles.logoImage}
        />
        <Text style={styles.formTitleView}>Join Now</Text>

        <TextInput
          style={styles.formView}
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.formView}
          placeholder="Email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.formView}
          placeholder="Phone Number"
          placeholderTextColor="gray"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <DropDownPicker
          open={educationOpen}
          value={educationLevel}
          items={edlevel}
          setOpen={setEducationOpen}
          setValue={setEducationLevel}
          setItems={setEdLevel}
          style={[styles.formView]}
          textStyle={{ color: '#000' }}
          placeholder="Select Educational Level"
          dropDownContainerStyle={{ zIndex: 999999 }}

        />

        {showIns && (
          <TextInput
            style={styles.formView}
            placeholder="Institution"
            placeholderTextColor="gray"
            value={institution}
            onChangeText={setInstitution}
          />
        )}

        {showCls && (
          <DropDownPicker
            open={classOpen}
            value={schoolClass}
            items={clLevels}
            setOpen={setClassOpen}
            setValue={setSchoolClass}
            setItems={setClLevels}
            style={[styles.formView]}
            textStyle={{ color: '#000' }}
            placeholder="Select Class Level"
          />
        )}

        {showCgd && (
          <DropDownPicker
            open={degreeOpen}
            value={collegeDegree}
            items={cdLevels}
            setOpen={setDegreeOpen}
            setValue={setCollegeDegree}
            setItems={setCdLevels}
            style={[styles.formView]}
            textStyle={{ color: '#000' }}
            placeholder="Select College Degree"
          />
        )}

        {collegeDegree === 'other' && (
          <TextInput
            style={styles.formView}
            placeholder="Custom College Degree"
            placeholderTextColor="gray"
            value={customCollegeDegreet}
            onChangeText={setCustomCollegeDegree}
          />
        )}

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
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            secureTextEntry={!showCPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowCPassword(!showCPassword)}
            style={styles.showHideButton}
          >
            <Text style={styles.showHideText}>
              {showCPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0147ab',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 0,
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
    color: '#000',
  },
  formTitleView: {
    color: '#0147ab',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
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
  registerButton: {
    marginTop: 15,
    backgroundColor: '#0147ab',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
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
  loginText: {
    color: '#1e90ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RegisterScreen;
