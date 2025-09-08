import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userSignUp } from '../../API_STORE/user_api';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../Navigation/AuthContext';
import { colorPalette } from '../../assets/styles/Colors';
import { fetchInstitutions } from '../../API_STORE/ins_api';
import SvgIcons from '../../assets/styles/SvgIcons';

const RegisterScreen = ({ route }) => {
  const { setAuthUser } = useAuth();
  const navigation = useNavigation();
  const { role } = route.params || {};

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
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [institutionList, setInstitutionList] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [schools, setSchools] = useState([]);
  const [customInstitution, setCustomInstitution] = useState('');

  const [showIns, setShowIns] = useState(false);
  const [showCls, setShowCls] = useState(false);
  const [showCgd, setShowCgd] = useState(false);
  const [showExpertise, setShowExpertise] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [onOptionSelect, setOnOptionSelect] = useState(() => () => {});

  const edlevel = [
    { label: 'School', value: 'school' },
    { label: 'College', value: 'college' },
  ];

  const clLevels = [
    { label: 'LKG', value: 'lkg' },
    { label: 'UKG', value: 'ukg' },
    { label: 'Class 1', value: 'class_1' },
    { label: 'Class 2', value: 'class_2' },
    { label: 'Class 3', value: 'class_3' },
    { label: 'Class 4', value: 'class_4' },
    { label: 'Class 5', value: 'class_5' },
    { label: 'Class 6', value: 'class_6' },
    { label: 'Class 7', value: 'class_7' },
    { label: 'Class 8', value: 'class_8' },
    { label: 'Class 9', value: 'class_9' },
    { label: 'Class 10', value: 'class_10' },
    { label: 'Class 11', value: 'class_11' },
    { label: 'Class 12', value: 'class_12' },
  ];

  const cdLevels = [
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
  ];

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

  useEffect(() => {
    if (role?.toLowerCase() === 'teacher') {
      setShowCgd(true);
      setShowEducation(false);
      setShowExperience(true);
      setShowExpertise(true);
      setShowIns(true);
    } else {
      setShowCgd(false);
      setShowEducation(true);
      setShowExperience(false);
      setShowExpertise(false);
    }
  }, [role]);

  useEffect(() => {
    const fetchIns = async () => {
      try {
        const response = await fetchInstitutions();
        setInstitutionList(response.data);
        setSchools(response.data.filter((s) => s.type?.toLowerCase() === 'school'));
        setColleges(response.data.filter((c) => c.type?.toLowerCase() === 'college'));
      } catch (error) {
        console.log("Error fetching institutions:", error);
      }
    };
    fetchIns();
  }, []);

  const openModal = (title, options, onSelect) => {
    setModalTitle(title);
    setModalOptions(options);
    setOnOptionSelect(() => onSelect);
    setModalVisible(true);
  };
   const SwitchScreen = (screen, role) => {
    navigation.navigate(screen, {role: role});
  };

  const handleRegister = async () => {
    console.log("The click")
    if (
      !username ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      (educationLevel === 'school' && (!institution || !schoolClass)) ||
      (educationLevel === 'college' && (!institution || !collegeDegree)) ||
      (educationLevel === 'graduated' && !collegeDegree) ||
      (role === 'teacher' && (!expertise || !experience))
    ) {
      Toast.show({ type: 'error', text1: 'Please fill in all required fields.' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
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
        institution: institution === 'other' ? null : institution,
        otherInstitution: customInstitution,
        schoolClass,
        educationLevel,
        collegeDegree,
        customCollegeDegree: collegeDegree === 'other' ? customCollegeDegree : null,
        expertise,
        experience,
        role: role.toLowerCase(),
      };

      if (institution === 'other' && !customInstitution) {
        Toast.show({ type: 'error', text1: 'Please enter the name of the institution.' });
        return;
      }

      const result = await userSignUp({ data });

      if (result && result.success) {
        Toast.show({ type: 'success', text1: 'Registered Successfully' });
        navigation.navigate('Login');
      } else {
        Toast.show({ type: 'error', text1: result?.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Toast.show({ type: 'error', text1: 'An unexpected error occurred. Please try again later.' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
      <View style={styles.formContainer}>
        <Text style={styles.formTitleView}>Join Now</Text>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput style={styles.formView} placeholder="Enter the Username" value={username} onChangeText={setUsername} />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.formView} placeholder="Enter the Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput style={styles.formView} placeholder="Enter the Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <Text style={styles.inputLabel}>Educational Level</Text>
        {showEducation && (
          <TouchableOpacity style={styles.formView} onPress={() => openModal("Select Education Level", edlevel, (item) => setEducationLevel(item.value))}>
            <Text>{educationLevel ? edlevel.find(i => i.value === educationLevel)?.label : 'Select Education Level'}</Text>
          </TouchableOpacity>
        )}
        
        {
          showIns && showEducation &&(
            <Text style={styles.inputLabel}>Institutions</Text>
          )
        }
        {showIns && (
          <>
          <TouchableOpacity style={styles.formView} onPress={() => openModal("Select Institution", [
            ...((educationLevel === 'college' ? colleges : schools).map(i => ({ label: i.name, value: i._id }))),
            { label: 'Other', value: 'other' }
          ], (item) => setInstitution(item.value))}>
            <Text>{institution ? (institution === 'other' ? 'Other' : [...schools, ...colleges].find(i => i._id === institution)?.name) : 'Select Institution'}</Text>
          </TouchableOpacity>
          </>
        )}

        {institution === 'other' && (
          <TextInput style={styles.formView} placeholder="Enter Institution Name" value={customInstitution} onChangeText={setCustomInstitution} />
        )}

        {showCls && (
                  <Text style={styles.inputLabel}>Class Level</Text>
        )}

        {showCls && (
          
          <TouchableOpacity style={styles.formView} onPress={() => openModal("Select Class", clLevels, (item) => setSchoolClass(item.value))}>
            <Text>{schoolClass ? clLevels.find(i => i.value === schoolClass)?.label : 'Select Class Level'}</Text>
          </TouchableOpacity>
        )}

{showCgd && (
                  <Text style={styles.inputLabel}>College Degree</Text>
        )}
        {showCgd && (
          <TouchableOpacity style={styles.formView} onPress={() => openModal("Select Degree", cdLevels, (item) => setCollegeDegree(item.value))}>
            <Text>{collegeDegree ? cdLevels.find(i => i.value === collegeDegree)?.label : 'Select Degree'}</Text>
          </TouchableOpacity>
        )}

        {collegeDegree === 'other' && (
          <TextInput style={styles.formView} placeholder="Enter the Custom College Degree" value={customCollegeDegree} onChangeText={setCustomCollegeDegree} />
        )}
{showExpertise && (
           <Text style={styles.inputLabel}>Expertise</Text>
        )}
        {showExpertise && (
          <TextInput style={styles.formView} placeholder="Enter the Expertise" value={expertise} onChangeText={setExpertise} />
        )}
{showExperience && (
<Text style={styles.inputLabel}>Experience</Text>
        )}
        {showExperience && (
          <TextInput style={styles.formView} placeholder="Enter the Experience" value={experience} onChangeText={setExperience} />
        )}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          {SvgIcons.lock}
          <TextInput style={styles.passwordInput} placeholder="Enter the Password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showHideButton}>
            <Text style={styles.showHideText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          {SvgIcons.lock}
          <TextInput style={styles.passwordInput} placeholder="Enter the Confirm Password" secureTextEntry={!showCPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
          <TouchableOpacity onPress={() => setShowCPassword(!showCPassword)} style={styles.showHideButton}>
            <Text style={styles.showHideText}>{showCPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <FlatList
                data={modalOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setModalVisible(false);
                      onOptionSelect(item);
                    }}>
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => SwitchScreen('Login', role)}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#85db51',
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  formTitleView: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formView: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,

  },
  showHideButton: {
    paddingHorizontal: 10,
  },
  showHideText: {
    color: '#85db51',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: colorPalette.transBlue,
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#85db51',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: colorPalette.blue || '#007bff',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#fff',
  },
  loginText: {
    fontSize: 16,
    color: colorPalette.white,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});

export default RegisterScreen;
