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
import logo from '../assets/images/kadiralogo.png';
import { colorPalette } from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
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
      setCourses(result || []);
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

    if (!filteredCourses?.length) {
      return <Text style={{ textAlign: 'center', marginTop: 50 }}>No Courses Found</Text>;
    }

    return (
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CourseCard course={item} courses={courses} showType="fullBlock" />}
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
        <View style={styles.containerParent}>
          <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
          </View>
          <TouchableOpacity style={styles.searchContainer} onPress={() => navigator.navigate('Profile')}>
            <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#fff" viewBox="0 0 16 16">
              <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <Path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </Svg>
            <Text style={styles.loginText}>Hi, {authUser?.username || 'User'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[homeStyle.courseFlex, { marginTop: 20 }]}>
          <View style={styles.headingContainer}>
            <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>Explore Courses</Text>
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
    backgroundColor: '#0147ab',
    paddingHorizontal: 10,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    justifyContent: 'flex-start',
  },
  logo: {
    width: 100,
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
    color: '#fff',
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#0147ab',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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

export default HomeScreen;
