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
  Modal
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
import TeacherCourseCard from '../Components/CourseComponents/TeacherCourseCard';

const Approvals = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joinCodeModal, setJoinCodeModal] = useState(false);
  const [joincode, setJoincode] = useState('');

  const { authUser } = useAuth();
  const navigator = useNavigation();

  const loadCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchCourses();
      const teacherCourser = result.filter((f) => f.created_by === authUser?._id);
      setCourses(teacherCourser || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const filteredCourses = useMemo(() => {
    return [...courses].reverse(); // simple derived state
  }, [courses]);

  const handleJoinCode = async () => {
    try {
      const request = await AddJoinCodeRequest({ joinCode: joincode, userId: authUser?._id });

      if (request.success) {
        Toast.show({ type: 'success', text1: 'Joined course successfully' });
        setJoinCodeModal(false);
        setJoincode('');
        await loadCourses(); // Refresh after join
      } else {
        Toast.show({ type: 'error', text1: request.error || 'Join request failed' });
      }
    } catch (error) {
      console.error('Join code error:', error);
      Toast.show({ type: 'error', text1: 'Unexpected error occurred' });
    }
  };

  const renderCourseList = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0147ab" />;
    }

    if (!courses?.length) {
      return <Text style={{ textAlign: 'center', marginTop: 20 }}>No Courses Found</Text>;
    }

    return (
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TeacherCourseCard course={item} courses={courses} showType="fullBlock" />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    );
  };

  return (
    <SafeAreaView style={homeStyle.screenBg}>
      <ScrollView
        contentContainerStyle={homeStyle.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >

        <View style={[homeStyle.courseFlex, { marginTop: 10 }]}>
          <View style={styles.headingContainer}>
            <Text style={[homeStyle.titleText, { marginBottom: 0, marginTop: 10 }]}>Your Courses</Text>
            {/* <TouchableOpacity style={styles.joinButton} onPress={() => setJoinCodeModal(true)}>
              <Text style={styles.btnText}>Join with code</Text>
            </TouchableOpacity> */}
          </View>

          {renderCourseList()}
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
    color: '#0147ab',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
    marginBottom: 0,
  },
  joinButton: {
    backgroundColor: '#0147ab',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: '#0147ab',
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

export default Approvals;
