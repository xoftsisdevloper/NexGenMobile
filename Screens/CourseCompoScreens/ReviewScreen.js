import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import Ratings from '../../Components/CourseComponents/Ratings';

export const  ReviewScreen =  ({courseData}) => {
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.textContainer}>
        <Text style={{marginVertical: 10, fontSize: 18, fontWeight: '700'}}>See what our learners say</Text>
        <Ratings ratings={courseData.ratings} page = {"CourseDetailPage"} />
      </View>
    </View>
  );
}

export default ReviewScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  title: {
    fontWeight: '700',

  },

  textContainer: {
    padding: 15
  }
})