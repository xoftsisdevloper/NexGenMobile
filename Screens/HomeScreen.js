import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import CourseCard from '../Components/CourseComponents/CourseCard';
import TopBar from '../Components/TopBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-elements';
import { fetchCourses } from '../API_STORE/course_api';
import { ActivityIndicator } from 'react-native';
import { homeStyle } from '../assets/styles/Styles';

const HomeScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      );
    }

    return (
      <>
        <View style={[homeStyle.courseFlex, { marginVertical: 20 }]} >
          <Text style={homeStyle.titleText}>New Courses</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CourseCard course={item} />}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={homeStyle.courseFlex}>
          <Text style={homeStyle.titleText}>Top Rated Courses</Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CourseCard course={item} />}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={homeStyle.courseFlex}>
          <Text style={[homeStyle.titleText, { marginBottom: 0 }]}>
            Explore Courses
          </Text>
          <FlatList
            data={courses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CourseCard course={item} showType={'fullBlock'} />}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={homeStyle.screenBg}>
      <ScrollView contentContainerStyle={homeStyle.scrollViewContent}>
        {renderCourses()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;