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
          onRefresh();
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 20 }}
      contentContainerStyle={styles.filterRow}
    >
      {courseTypes?.map(type => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            selectedType === type && styles.activeFilter
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text style={styles.filterText}>
            {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    const parts = fullName.trim().split(' ');
    return parts[0] || fullName;
  };

  return (
    <SafeAreaView style={homeStyle.screenBg}>
      <ScrollView
        contentContainerStyle={homeStyle.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.containerParent}>
          <Image source={logo} style={styles.logo} />
          <TouchableOpacity style={styles.searchContainer} onPress={() => navigator.navigate('Profile')}>
            <Svg width={30} height={30} viewBox="0 0 32 32" fill="none">
              <Path
                d="M16 16c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm0 2c-4.418 0-13 2.239-13 6.667V30h26v-5.333C29 20.239 20.418 18 16 18z"
                fill="#0147AB"
                opacity={0.15}
              />
              <Path
                d="M16 15c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm0 2c-4.418 0-12 2.239-12 6.667V29h24v-5.333C28 19.239 20.418 17 16 17z"
                stroke="#0147AB"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.loginText}>Hi, {getFirstName(authUser?.username) }</Text>
          </TouchableOpacity>
        </View>

        {/* Title + Join Button */}
        <View style={styles.headingContainer}>
          <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>Explore Courses</Text>
          <TouchableOpacity style={styles.joinButton} onPress={openModal}>
            <Text style={styles.btnText}>Join code</Text>
          </TouchableOpacity>
        </View>

        {renderCourseFilters()}

        {/* Course List */}
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
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Course Not Found</Text>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Join Code Modal */}
      <Modal animationType="fade" transparent visible={joinCodeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerParent: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#0147AB',
  },
  logo: {
    width: 160,
    height: 50,
    resizeMode: 'contain',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
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
    alignItems: 'center',
  },
  formInput: {
    borderWidth: 1,
    width: 280,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: colorPalette.blue,
    width: 280,
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
