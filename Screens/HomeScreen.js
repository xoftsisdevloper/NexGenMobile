import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import CourseCard from '../Components/CourseComponents/CourseCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text } from 'react-native-elements';
import logo from '../assets/images/logo.png'
import { fetchCourses } from '../API_STORE/course_api';
import { ActivityIndicator } from 'react-native';
import { homeStyle } from '../assets/styles/Styles';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from './ProfileScreen';
import { useAuth } from '../Navigation/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigation();
  const { authUser } = useAuth();
  
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

  const renderCourses = () => {
    return (
      <>
        <View style={[homeStyle.courseFlex, { marginTop: 20 }]}>
          {
            isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />

            ) : (
              <View>
                <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>
                  Explore Courses
                </Text>
                <FlatList
                  data={courses}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => <CourseCard course={item} courses={courses} showType={'fullBlock'} />}
                />
              </View>
            )

          }
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
            <Text style={styles.title}>NexGen</Text>
          </View>
          <TouchableOpacity style={styles.searchContainer} onPress={() => navigator.navigate('Profile')}>
            <View style={styles.searchContainer}>
              < Svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill='#0147ab' class="bi bi-person-circle" viewBox="0 0 16 16" >
                <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <Path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
              </ Svg >
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
    padding: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    width: 40,
    height: 40,
    marginRight: 5,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '600',
  }
});

export default HomeScreen;