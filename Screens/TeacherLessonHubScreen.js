import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { fetchAllTests } from '../API_STORE/test_api';
import { SvgUri } from 'react-native-svg';
import { colorPalette } from '../assets/styles/Colors';

const TeacherLessonHubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemDetails: subject } = route.params;

  const [tests, setTests] = useState([]);
  const [preTest, setPreTest] = useState(null);
  const [postTest, setPostTest] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTest, setCurrentTest] = useState([]);
  const loadTests = useCallback(async () => {
    try {
      const response = await fetchAllTests();
      setTests(response.data);
    } catch (error) {
      console.error('Error loading tests:', error);
    }
  }, []);

  const getTest = () => {
    return tests.filter(
      (test) => test?.test_subject?._id  === subject?.course_id && test?.test_lesson?._id === subject?._id 
    );
  };

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  useEffect(() => {
    if (tests.length > 0) {
      setPreTest(getTest('pre-test'));
      setPostTest(getTest('post-test'));
    }
    setCurrentTest(getTest());
  }, [tests]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTests();
    setRefreshing(false);
  };

  const handleNavigation = (screen, data) => {
    navigation.navigate(screen, data);
  };

  const showToast = (message) => {
    Toast.show({ type: 'error', text1: message, position: 'top' });
  };

  console.log("preTest", getTest('pre-test'))
  console.log("subject Id",currentTest)

  const renderCard = (title, image, onPress, disabled = false) => (
    <View style={[styles.card, disabled && styles.disabledCard]}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.cardImage} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.cardGrid}>
        {renderCard('Lesson Detail', require('../assets/images/lessonPlan.jpg'), () =>
          handleNavigation('LessonPlan', { item: subject })
        )}

        {renderCard('Materials', require('../assets/images/meterials2.png'), () =>
          handleNavigation('MeterialList', { item: subject })
        )}

        {renderCard(
          'Tests',
          require('../assets/images/afterTest.jpg'),
          () =>
            handleNavigation('ToggleTest', { test: currentTest })
        )}

        {renderCard(
          'Leader Board',
          require('../assets/images/results.jpg'),
          () => {
            if (tests.length > 0) {
              handleNavigation('LeaderBoard', { pre_test: preTest, post_test: postTest });
            } else {
              showToast('No Leaderboard Found');
            }
          }
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.aliceBlue,
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
    elevation: 5,
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 0.4,
  },
  imageContainer: {
    padding: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 100,
    resizeMode: 'center',
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TeacherLessonHubScreen;
