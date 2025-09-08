import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchCourses } from '../API_STORE/course_api';
import CourseCard from '../Components/CourseComponents/CourseCard';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../Navigation/AuthContext';
import { colorPalette } from '../assets/styles/Colors';

const courseTypes = ["public", "private"];

const SearchScreen = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { authUser } = useAuth();

  const fetchData = async () => {
    try {
      const allCourses = await fetchCourses();
      console.log('Fetched courses:', allCourses);
      let relevantCourses = [];

      const isTeacherOrAdmin = authUser?.role === 'teacher' || authUser?.isAdmin;

      if (isTeacherOrAdmin) {
        // Show all non-general courses for teachers/admins
        relevantCourses = allCourses.filter(course => course.course_type !== 'public' && course.created_by === authUser._id);
      } else {
        // For students: show only approved or pending non-general courses
        const pendingCourses = allCourses.filter(course =>
          course.course_type !== 'public' &&
          course.joinRequests?.some(req => req.user._id === authUser._id && req.status === 'pending')
        ).map(c => ({ ...c, isPending: true }));

        const approvedCourses = allCourses.filter(course =>
          course.course_type !== 'public' &&
          course.joinRequests?.some(req => req.user._id === authUser._id && req.status === 'approved')
        ).map(c => ({ ...c, isPending: false }));

        const merged = [...pendingCourses];
        approvedCourses.forEach(c => {
          if (!merged.some(e => e._id === c._id)) merged.push(c);
        });

        relevantCourses = merged;
      }

      setCourses(relevantCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let data = courses;
    if (selectedType !== 'all') {
      data = data.filter(course => course.course_type?.toLowerCase() === selectedType);
    }

    if (searchText.trim()) {
      data = data.filter(course =>
        course.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredCourses(data);
  }, [searchText, selectedType, courses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colorPalette.aliceBlue }}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <TextInput
            placeholder="Search courses..."
            value={searchText}
            placeholderTextColor={'#000'}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchText('')}
            >
              <Svg width="16" height="16" fill="gray" viewBox="0 0 16 16">
                <Path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
              </Svg>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {courseTypes.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                styles.filterButton,
                selectedType === type && styles.activeFilter
              ]}
            >
              <Text style={styles.filterText}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={[...filteredCourses].reverse()}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CourseCard course={item} showType="fullBlock" courses={courses} />
            )}
            ListEmptyComponent={() => (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No courses found</Text>
            )}
            scrollEnabled={false} // Disable FlatList scroll to prevent conflict with ScrollView
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#000',
    borderRadius: 30,
    height: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 30,
    top: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
    height: 33,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#85db51',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SearchScreen;
