import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchCourses } from '../API_STORE/course_api';
import CourseCard from '../Components/CourseComponents/CourseCard';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../Navigation/AuthContext';
import { colorPalette } from '../assets/styles/Colors';

const SearchScreen = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { authUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const fetchedCourses = await fetchCourses();
      const filteredCourse = authUser?.role === 'teacher' ? fetchedCourses.filter((f) => f.created_by === authUser._id) : fetchedCourses;
      setCourses(filteredCourse);
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
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const handleClearText = () => {
    setSearchText('');
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={{ flex: 1, padding: 20, backgroundColor: colorPalette.aliceBlue }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View>
        <TextInput
          placeholder="Search courses..."
          value={searchText}
          placeholderTextColor={'#000'}
          onChangeText={handleSearchTextChange}
          focusable={true}
          height={40}
          style={{ borderWidth: 1, paddingHorizontal: 15, marginBottom: 10, color: '#000', placeholderTextColor: '#000', borderRadius: 30 }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearText}
          >
            <Text style={styles.clearButtonText}>
              <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <Path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </Svg>
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: '100%' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              <CourseCard course={item} showType={'fullBlock'} courses={courses} />
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  clearButtonText: {
    color: 'gray',
    marginTop: 2,
    backgroundColor: 'white',
  },
})

export default SearchScreen;