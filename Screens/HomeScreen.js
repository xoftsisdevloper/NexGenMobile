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

  // Fetch courses
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

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Filter data into general, pending, and approved sets
  useEffect(() => {
    const generalCourses = courses
      .filter(course => course.course_type?.toLowerCase() === 'general')
      .map(course => ({ ...course, isPending: false }));

    const pendingCourses = courses
      .filter(course =>
        course.joinRequests?.some(request =>
          request.user._id === authUser._id && request.status === 'pending'
        ) && course.course_type !== 'general'
      )
      .map(course => ({ ...course, isPending: true }));

    const approvedCourses = courses
      .filter(course =>
        course.joinRequests?.some(request =>
          request.user._id === authUser._id && request.status === 'approved'
        ) && course.course_type !== 'general'
      )
      .map(course => ({ ...course, isPending: false }));

    const all = [...generalCourses];
    pendingCourses.forEach(c => {
      if (!all.some(e => e._id === c._id)) all.push(c);
    });
    approvedCourses.forEach(c => {
      if (!all.some(e => e._id === c._id)) all.push(c);
    });

    setFreeCoursesData(all);
  }, [courses, authUser]);

  // Update filtered courses when type changes
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

  // Handle join code submission
  const handleJoinCode = async () => {
    try {
      const response = await AddJoinCodeRequest({
        joinCode: joincode,
        userId: authUser?._id,
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

  // Get course count for badges
  const getCourseCountByType = (type) => {
    if (type === 'all') return freeCoursesData.length;
    return freeCoursesData.filter(course => course.course_type?.toLowerCase() === type).length;
  };

  // Render course filters
  const renderCourseFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 10, paddingTop: 10, width: '95%', margin: 'auto' }}
      contentContainerStyle={styles.filterRow}
    >
      {courseTypes.map(type => {
        const count = getCourseCountByType(type);
        const isActive = selectedType === type;

        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              isActive ? styles.activeFilter : styles.inactiveFilter,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.filterText,
                isActive ? styles.activeFilterText : styles.inactiveFilterText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>

            {/* Badge */}
            <View
              style={[
                styles.badge,
                isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isActive ? styles.activeBadgeText : styles.inactiveBadgeText,
                ]}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
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
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.containerParent}>
          <Text style={styles.loginText}>Hi, {getFirstName(authUser?.username)}</Text>
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => navigator.navigate('Profile')}
          >
            <Svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 24 24" fill="none">
              <Path opacity="0.4" d="M12 22.01C17.5228 22.01 22 17.5329 22 12.01C22 6.48716 17.5228 2.01001 12 2.01001C6.47715 2.01001 2 6.48716 2 12.01C2 17.5329 6.47715 22.01 12 22.01Z" fill="#fff" />
              <Path d="M12 6.93994C9.93 6.93994 8.25 8.61994 8.25 10.6899C8.25 12.7199 9.84 14.3699 11.95 14.4299C11.98 14.4299 12.02 14.4299 12.04 14.4299C12.06 14.4299 12.09 14.4299 12.11 14.4299C12.12 14.4299 12.13 14.4299 12.13 14.4299C14.15 14.3599 15.74 12.7199 15.75 10.6899C15.75 8.61994 14.07 6.93994 12 6.93994Z" fill="#fff" />
              <Path d="M18.7807 19.36C17.0007 21 14.6207 22.01 12.0007 22.01C9.3807 22.01 7.0007 21 5.2207 19.36C5.4607 18.45 6.1107 17.62 7.0607 16.98C9.7907 15.16 14.2307 15.16 16.9407 16.98C17.9007 17.62 18.5407 18.45 18.7807 19.36Z" fill="#fff" />
            </Svg>
          <Text style={{fontSize: 20, color: '#fff', fontWeight: '700' }}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* White Curved Background with Content */}
        <View style={styles.curve}>
          <View style={styles.headingContainer}>
            <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>Courses</Text>
          </View>

          {renderCourseFilters()}

          <View style={{ marginTop: 0, paddingHorizontal: 14 }}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : filteredCourses.length > 0 ? (
              filteredCourses
                .slice()
                .reverse()
                .map((item) => (
                  <CourseCard
                    key={item._id}
                    course={item}
                    courses={courses}
                    showType="fullBlock"
                  />
                ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16, color: '#888' }}>
                No {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Courses Found
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Join Button */}
      <TouchableOpacity style={styles.joinButton} onPress={openModal}>
        <Text style={styles.jbtnText}>+</Text>
      </TouchableOpacity>

      {/* Join Code Modal */}
      <Modal animationType="fade" transparent visible={joinCodeModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
              <Image
                source={require('../assets/images/cancel.png')}
                style={styles.cancelImage}
              />
            </TouchableOpacity>
            <View style={styles.codeForm}>
              <Image
                source={require('../assets/images/joincode.png')}
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
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  containerParent: {
    backgroundColor: '#85db51',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 30,
    height: 130,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer'
  },
  loginText: {
    fontSize: 25,
    fontWeight: '700',
    textTransform: 'capitalize',
    color: '#ffffff',
  },
  headingContainer: {
    paddingHorizontal: 20,
    marginVertical: 0,
  },
  joinButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#85db51',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  jbtnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterRow: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
    position: 'relative',
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveFilter: {
    backgroundColor: '#85db51',
  },
  activeFilter: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#85db51',
  },
  inactiveFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#85db51',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  inactiveBadge: {
    backgroundColor: '#fff',
  },
  activeBadge: {
    backgroundColor: '#85db51',
  },
  inactiveBadgeText: {
    color: '#85db51',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    width: 280,
    paddingVertical: 10,
    marginVertical: 12,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#85db51',
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
  curve: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 20,
    marginTop: -40,
    zIndex: 1,
  },

  filterRow: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingRight: 20, // 👈 ensures last item isn't cut off
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
    position: 'relative',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

});

export default HomeScreen;
