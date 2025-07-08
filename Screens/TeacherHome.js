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
import logo from '../assets/images/Nexgen.png';
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
      const teacherCourses = result.filter(f => f.created_by === userId);
      setCourses(teacherCourses || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

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
      return <ActivityIndicator size="large" color="#0147ab" />;
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    justifyContent: 'flex-start',
  },
  logo: {
    width: 180,
    height: '100%',
    resizeMode: 'contain',
    marginRight: 5,
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
    color: '#000',
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
    borderColor: '#0147ab',
  },
  activeFilter: {
    backgroundColor: '#0147ab',
  },
  filterText: {
    color: '#0147ab',
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
