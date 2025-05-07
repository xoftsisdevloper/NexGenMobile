import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchAllTests } from '../API_STORE/test_api';

const LessonHubScreen = () => {
  const route = useRoute();
  const { itemDetails } = route.params;
  const subject = itemDetails;
  const navigation = useNavigation();
  const [tests, setTests] = React.useState([]);
  const navigateScreen = (screenName, data = null) => {
    navigation.navigate(screenName, data);
  }
  const [preTest, setPreTest] = React.useState(null);
  const [postTest, setPostTest] = React.useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetchAllTests(); // Replace with your API endpoint
        console.log('Fetched tests:', response);
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    }
    fetchTests();
  }
  , [subject]);

  const getTestForCourseAndSubject = (subject, test_type ) => {
    const filteredTests = tests.filter(test => test.test_lesson._id === subject && test.test_type === test_type);
    return filteredTests.length > 0 ? filteredTests[0] : null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardGrid}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigateScreen('LessonPlan', { item: subject })}>
            <View style={styles.imageContainer}>
              <Image source={require("../assets/images/lessonPlan.jpg")} style={styles.cardImage} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Lesson Plan</Text>
              {/* You can add more details here */}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigateScreen('MeterialList', {item: subject})}>
            <View style={styles.imageContainer}>
              <Image source={require("../assets/images/meterials2.png")} style={styles.cardImage} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Meterials</Text>
              {/* You can add more details here */}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TouchableOpacity onPress={ ()=> navigateScreen('TestScreen', {test: getTestForCourseAndSubject(subject._id, 'pre-test')}) }>
            <View style={styles.imageContainer}>
              <Image source={require("../assets/images/test.png")} style={styles.cardImage} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>PRE-Test</Text>
              {/* You can add more details here */}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card} >
          <TouchableOpacity onPress={ ()=> navigateScreen('TestScreen', {test: getTestForCourseAndSubject(subject._id, 'post-test')}) }>
            <View style={styles.imageContainer}>
              <Image source={require("../assets/images/afterTest.jpg")} style={styles.cardImage} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>POST-Test</Text>
              {/* You can add more details here */}
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 100,
    marginBottom: 0,
    resizeMode: 'center',
    borderWidth: 0
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'gray',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  imageContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default LessonHubScreen;