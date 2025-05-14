import React from 'react'
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import CourseCard from '../Components/CourseComponents/CourseCard'
import { useRoute } from '@react-navigation/native';
import TabViewExample from '../Components/CourseComponents/Tabs';

function CourseDetailScreen() {
  const route = useRoute();
  const { course, courses } = route.params;
  

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <View>
        <ImageBackground source={{uri: course.imageUrl}} style={styles.imageBg}>
          <View style={[styles.overlay, { mixBlendMode: 'overlay' }]}>
            <View style={styles.courseTitleContainer}>
              <Text style={styles.courseTitle}>{course.name}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>      
      <TabViewExample courseData = {course} courses = {courses}/>
    </ScrollView>
  )
}

export default CourseDetailScreen;

const styles = StyleSheet.create({
  imageBg: {
    width: '100%',
    resizeMode: 'cover',
    minHeight: '130',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.51)',
  },
  courseTitleContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
  },
  courseTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  }
})