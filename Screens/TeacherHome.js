import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Image } from 'react-native-elements';
import Svg, { Path } from 'react-native-svg';
import Toast from 'react-native-toast-message';

import { fetchCourses, AddJoinCodeRequest } from '../API_STORE/course_api';
import { useAuth } from '../Navigation/AuthContext';
import CourseCard from '../Components/CourseComponents/CourseCard';
import { homeStyle } from '../assets/styles/Styles';
import logo from '../assets/images/macelogo.png';
import { colorPalette } from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';

const courseTypes = ['all', 'general', 'academic', 'school', 'college'];

const getFirstName = (fullName) => {
  if (!fullName) return 'User';
  const parts = fullName.trim().split(' ');
  return parts[0] || fullName;
};

const TeacherHomeScreen = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joinCodeModal, setJoinCodeModal] = useState(false);
  const [joincode, setJoincode] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const { authUser } = useAuth();
  const navigator = useNavigation();
  const userId = authUser?._id;

const loadCourses = useCallback(async () => {
  try {
    setIsLoading(true);
    const result = await fetchCourses();

    const allowedCourseIds = new Set(authUser?.institution?.course_access || []);
    const courseMap = new Map();

    result.forEach(c => {
      if (c.created_by === userId || allowedCourseIds.has(c._id)) {
        courseMap.set(c._id, c); // Ensures uniqueness
      }
    });

    setCourses(Array.from(courseMap.values()));
  } catch (err) {
    console.error('Failed to fetch courses:', err);
  } finally {
    setIsLoading(false);
  }
}, [userId, authUser]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const filteredCourses = useMemo(() => {
    if (selectedType === 'all') {
      return [...courses].reverse();
    }
    return [...courses].filter(course => course.course_type === selectedType).reverse();
  }, [courses, selectedType]);

  const handleJoinCode = async () => {
    try {
      const request = await AddJoinCodeRequest({ joinCode: joincode, userId });

      if (request.success) {
        Toast.show({ type: 'success', text1: 'Joined course successfully' });
        setJoinCodeModal(false);
        setJoincode('');
        await loadCourses();
      } else {
        Toast.show({ type: 'error', text1: request.error || 'Join request failed' });
      }
    } catch (error) {
      console.error('Join code error:', error);
      Toast.show({ type: 'error', text1: 'Unexpected error occurred' });
    }
  };

  const renderCourseFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
      style={{ marginTop: 5 }}
    >
      {courseTypes.map(type => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            selectedType === type && styles.activeFilter
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text style={[
            styles.filterText,
            selectedType === type && styles.activeFilterText
          ]}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );


  const renderCourseList = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#85db51" />;
    }

    if (!filteredCourses?.length) {
      return <Text style={{ textAlign: 'center', marginTop: 50 }}>No Courses Found</Text>;
    }

    return (
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CourseCard course={item} courses={filteredCourses} showType="fullBlock" />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    );
  };

  return (
    <SafeAreaView style={homeStyle.screenBg}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={homeStyle.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.containerParent}>
            <View style={styles.container}>
              <Image source={logo} style={styles.logo} />
            </View>
            <TouchableOpacity style={styles.searchContainer} onPress={() => navigator.navigate('Profile')}>
              <Svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none">
                <Path opacity="0.4" d="M12 22.01C17.5228 22.01 22 17.5329 22 12.01C22 6.48716 17.5228 2.01001 12 2.01001C6.47715 2.01001 2 6.48716 2 12.01C2 17.5329 6.47715 22.01 12 22.01Z" fill="#fff" />
                <Path d="M12 6.93994C9.93 6.93994 8.25 8.61994 8.25 10.6899C8.25 12.7199 9.84 14.3699 11.95 14.4299C11.98 14.4299 12.02 14.4299 12.04 14.4299C12.06 14.4299 12.09 14.4299 12.11 14.4299C12.12 14.4299 12.13 14.4299 12.13 14.4299C14.15 14.3599 15.74 12.7199 15.75 10.6899C15.75 8.61994 14.07 6.93994 12 6.93994Z" fill="#fff" />
                <Path d="M18.7807 19.36C17.0007 21 14.6207 22.01 12.0007 22.01C9.3807 22.01 7.0007 21 5.2207 19.36C5.4607 18.45 6.1107 17.62 7.0607 16.98C9.7907 15.16 14.2307 15.16 16.9407 16.98C17.9007 17.62 18.5407 18.45 18.7807 19.36Z" fill="#fff" />
              </Svg>
              <Text style={styles.loginText}>Hi, {getFirstName(authUser?.username)}</Text>
            </TouchableOpacity>
          </View>

          <View style={[homeStyle.courseFlex, { marginTop: 20 }]}>
            <View style={styles.headingContainer}>
              <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>Explore Courses</Text>
              {renderCourseFilters()}
            </View>

            {renderCourseList()}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Modal animationType="fade" transparent visible={joinCodeModal}>
        <KeyboardAvoidingView
          style={styles.centeredView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalView}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setJoinCodeModal(false)}>
              <Image source={require('../assets/images/cancel.png')} style={styles.cancelImage} />
            </TouchableOpacity>

            <View style={styles.codeForm}>
              <Image source={require('../assets/images/joincode.png')} style={styles.joincodeImage} />
              <TextInput
                placeholder="Enter the code to join"
                style={styles.formInput}
                value={joincode}
                onChangeText={setJoincode}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleJoinCode}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerParent: {
    backgroundColor: '#85db51',
    padding: 10,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start'

  },
  logo: {
    width: 180,
    height: '100%',
    resizeMode: 'contain',
    marginRight: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  searchContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffffff',
  },
  headingContainer: {
    flexDirection: 'column',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#85db51',
  },
  activeFilter: {
    backgroundColor: '#85db51',
  },
  filterText: {
    color: '#85db51',
    fontWeight: '600',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorPalette.blackTrans,
  },
  modalView: {
    backgroundColor: colorPalette.white,
    width: 330,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  cancelImage: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 250,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: colorPalette.blue,
    width: 250,
    marginTop: 10,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  joincodeImage: {
    width: 250,
    height: 150,
    resizeMode: 'center',
  },
  codeForm: {
    alignItems: 'center',
  },
});

export default TeacherHomeScreen;
