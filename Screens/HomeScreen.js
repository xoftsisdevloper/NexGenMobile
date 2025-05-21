import React, { useState, useEffect } from 'react';
import {
  View, FlatList, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Modal, TextInput,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Image, Text } from 'react-native-elements';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Navigation/AuthContext';
import { fetchCourses, AddJoinCodeRequest } from '../API_STORE/course_api';
import CourseCard from '../Components/CourseComponents/CourseCard';
import Toast from 'react-native-toast-message';
import logo from '../assets/images/Nexgen.png';
import { homeStyle } from '../assets/styles/Styles';
import { colorPalette } from '../assets/styles/Colors';

const courseTypes = ['all', 'general', 'academic', 'school', 'college'];

const HomeScreen = () => {
  const [courses, setCourses] = useState([]);
  const [freeCoursesData, setFreeCoursesData] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [joinCodeModal, setJoinCodeModal] = useState(false);
  const [joincode, setJoincode] = useState('');
  const navigator = useNavigation();
  const { authUser } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {    
    fetchData();
  }, []);

    const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };


  useEffect(() => {
    const generalCourses = courses.filter(course =>
      course.course_type?.toLowerCase() === 'general'
    ).map(course => ({
      ...course,
      isPending: false,
    }));

    const pendingCourses = courses.filter(course =>
      course.joinRequests?.some(request =>
        request.user._id === authUser._id && request.status === 'pending'
      ) && course.course_type !== 'general'
    ).map(course => ({
      ...course,
      isPending: true,
    }));

    const approvedCourses = courses.filter(course =>
      course.joinRequests?.some(request =>
        request.user._id === authUser._id && request.status === 'approved'
      ) && course.course_type !== 'general'
    ).map(course => ({
      ...course,
      isPending: false,
    }));

    const all = [...generalCourses];
    pendingCourses.forEach(c => {
      if (!all.some(e => e._id === c._id)) all.push(c);
    });
    approvedCourses.forEach(c => {
      if (!all.some(e => e._id === c._id)) all.push(c);
    });

    setFreeCoursesData(all);
  }, [courses, authUser]);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredCourses([...freeCoursesData]);
    } else {
      setFilteredCourses(
        freeCoursesData.filter(course =>
          course.course_type?.toLowerCase() === selectedType
        )
      );
    }
  }, [selectedType, freeCoursesData]);

  const handleJoinCode = async () => {
    try {
      const response = await AddJoinCodeRequest({
        joinCode: joincode,
        userId: authUser?._id
      });

      if (response.success) {
        const matchedCourse = courses.find(course => course.join_code === joincode);
        if (matchedCourse && !freeCoursesData.some(c => c._id === matchedCourse._id)) {
          setFreeCoursesData(prev => [...prev, matchedCourse]);
        }
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: response.error || 'Join request failed',
        });
      }
    } catch (error) {
      console.error('Join code error:', error);
      Toast.show({
        type: 'error',
        text1: 'Unexpected error occurred',
      });
    }
  };

  const onClose = () => {
    setJoinCodeModal(false);
    setJoincode('');
  };

  const openModal = () => setJoinCodeModal(true);

  const renderCourseFilters = () => (
    <View style={styles.filterRow}>
      {courseTypes.map(type => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            selectedType === type && styles.activeFilter
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text style={styles.filterText}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={homeStyle.screenBg}>
      <ScrollView contentContainerStyle={homeStyle.scrollViewContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.containerParent}>
          <View style={styles.container}>
                      <Image source={logo} style={styles.logo} />
                    </View>
                    <TouchableOpacity style={styles.searchContainer} onPress={() => navigator.navigate('Profile')}>
                      <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#0147AB" viewBox="0 0 16 16">
                        <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <Path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                        />
                      </Svg>
                      <Text style={styles.loginText}>Hi, {authUser?.username || 'User'}</Text>
                    </TouchableOpacity>
        </View>

        <View style={styles.headingContainer}>
          <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>Explore Courses</Text>
          <TouchableOpacity style={styles.joinButton} onPress={openModal}>
            <Text style={styles.btnText}>Join code</Text>
          </TouchableOpacity>
        </View>

        {renderCourseFilters()}

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
                <Image
                  source={require('../assets/images/cancel.png')}
                  style={styles.cancelImage}
                />
              </TouchableOpacity>

              <View style={styles.codeForm}>
                <Image
                  source={require('../assets/images/joincode.jpg')}
                  style={styles.joincodeImage}
                />
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
          </View>
        </Modal>

        <View style={{ marginTop: 0, paddingHorizontal: 14 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={[...filteredCourses].reverse()}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <CourseCard course={item} courses={courses} showType="fullBlock" />
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Join Code Modal */}
      <Modal animationType="fade" transparent visible={joinCodeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setJoinCodeModal(false)}>
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
              <TouchableOpacity style={styles.submitButton} onPress={handleJoinCode}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  containerParent: {
    backgroundColor: '#0147ab',
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
  loginText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  logo: {
    width: 180,
    height: '100%',
    resizeMode: 'contain',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15
  },
  joinButton: {
    backgroundColor: '#0147ab',
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    columnGap: 8,
    
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#0147ab',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
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
  buttonClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cancelImage: {
    width: 30,
    height: 30,
    margin: 5,
  },
  codeForm: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  formInput: {
    borderWidth: 1,
    width: 250,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: colorPalette.blue,
    width: 250,
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

export default HomeScreen;
