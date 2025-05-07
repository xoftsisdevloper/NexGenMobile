import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import CourseCard from '../Components/CourseComponents/CourseCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image, Text } from 'react-native-elements';
import logo from '../assets/images/logo_primary.png';
import { AddJoinCodeRequest, fetchCourses } from '../API_STORE/course_api';
import { ActivityIndicator } from 'react-native';
import { homeStyle } from '../assets/styles/Styles';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from './ProfileScreen';
import { useAuth } from '../Navigation/AuthContext';
import { courseData } from '../mockdatas/mockData';
import { Modal } from 'react-native';
import { colorPalette } from '../assets/styles/Colors';
import { TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

const HomeScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigation();
  const { authUser } = useAuth();
  const [joinCodeModal, setJoinCodeModal] = useState(false);
  const [joincode, setJoincode] = useState('');
  const [freeCoursesData, setFreeCoursesData] = useState([]);
  const [approvalPendingCourses, setApprovalpendingCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCourses = await fetchCourses();

        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



  const onClose = () => {
    setJoinCodeModal(false);
    setJoincode('');
  };

  const openModal = () => {
    setJoinCodeModal(true);
  };

  const handleJoinCode = async () => {
    try {
      const request = await AddJoinCodeRequest({ joinCode: joincode, userId: authUser?._id });
  
      if (request.success) {
        const courseForCode = courses.find(course => course.join_code === joincode);
        if (courseForCode) {
          setFreeCoursesData(prevFreeCourses => [...prevFreeCourses, courseForCode]);
          setJoinCodeModal(false);
          setJoincode('');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Invalid join code',
            position: 'top',
          });
          console.log('Invalid join code');
          return;
        }
      } 
       else {
        Toast.show({
          type: 'error',
          text1: request.error || 'Join request failed',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Unexpected error during join code request:', error);
      Toast.show({
        type: 'error',
        text1: 'Unexpected error occurred',
        position: 'top',
      });
    }
  };

  useEffect(() => {
    const generalCourses = courses
      .filter(course => course?.course_type?.toLowerCase() === 'general')
      .map(course => ({
        ...course,
        isPending: false,
      }));
    setFreeCoursesData(generalCourses);
  }, [courses]);

  useEffect(() => {
    const pendingcourses = courses.filter(course =>
      course.joinRequests?.some(request =>
        request.user._id === authUser._id && request.status === 'pending'
      ) && course.course_type !== 'general'
    ).map(course => ({
      ...course,
      isPending: true
    }));
  
    setFreeCoursesData((prev) => {
      // Avoid adding duplicates
      const newCourses = pendingcourses.filter(p => !prev.some(c => c._id === p._id));
      return [...prev, ...newCourses];
    });
  }, [courses, authUser]);

  useEffect(() => {
    const approvedCourses = courses.filter(course =>
      course.joinRequests?.some(request =>
        request.user._id === authUser._id && request.status === 'approved'
      ) && course.course_type !== 'general'
    ).map(course => ({
      ...course,
      isPending: false
    }));
  
    setFreeCoursesData((prev) => {
      // Avoid adding duplicates
      const newCourses = approvedCourses.filter(p => !prev.some(c => c._id === p._id));
      return [...prev, ...newCourses];
    });
  }, [courses, authUser]);

  const renderCourses = () => {
    return (
      <>
        <View style={[homeStyle.courseFlex, { marginTop: 20 }]}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View>
              <View style={styles.headingContainer}>
                <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>
                  Explore Courses
                </Text>
                <TouchableOpacity style={styles.joinButton} onPress={openModal}>
                  <Text style={styles.btnText}>Join with code</Text>
                </TouchableOpacity>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={joinCodeModal}
                  onRequestClose={onClose}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={onClose}
                      >
                        <Image source={require('../assets/images/cancel.png')} style={styles.cancelImage} />
                      </TouchableOpacity>

                      <View style={styles.codeForm}>
                        <Image source={require('../assets/images/joincode.jpg')} style={styles.joincodeImage} />
                        <TextInput
                          placeholder="Enter the code to join"
                          style={styles.formInput}
                          value={joincode}
                          onChangeText={setJoincode}
                        />
                        <TouchableOpacity style={[styles.submitButton]} onPress={handleJoinCode}>
                          <Text style={styles.btnText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
              <FlatList
                data={freeCoursesData.reverse()}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <CourseCard course={item} courses={courses} showType={'fullBlock'} />
                )}
              />
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={homeStyle.screenBg}>
      <ScrollView contentContainerStyle={homeStyle.scrollViewContent}>
        <View style={styles.containerParent}>
          <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
          </View>
          <TouchableOpacity style={styles.searchContainer} onPress={() => navigator.navigate('Profile')}>
            <View style={styles.searchContainer}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="#0147ab"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <Path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                />
              </Svg>
              <Text style={styles.loginText}>Hi, {authUser ? authUser.username : 'User'} </Text>
            </View>
          </TouchableOpacity>
        </View>
        {renderCourses()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },

  containerParent: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  searchContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0147ab',
  },

  logo: {
    width: 180,
    height: '100%',
    resizeMode: 'contain',
    marginRight: 5,
  },

  loginText: {
    fontSize: 15,
    fontWeight: '600',
    cursor: 'pointer',
  },

  headingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  joinButton: {
    backgroundColor: '#0147ab',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  centeredView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorPalette.blackTrans,
  },

  modalView: {
    backgroundColor: colorPalette.white,
    width: 330,
    height: 300,
    borderRadius: 10,
    padding: 10,
  },

  cancelImage: {
    width: 30,
    height: 30,
    margin: 5,
  },

  buttonClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  formInput: {
    borderWidth: 1,
    width: 250,
    borderRadius: 5,
    paddingHorizontal: 10,
  },

  codeForm: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  submitButton: {
    backgroundColor: colorPalette.blue,
    width: '250',
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
});

export default HomeScreen;