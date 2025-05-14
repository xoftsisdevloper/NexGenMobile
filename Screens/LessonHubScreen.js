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

const LessonHubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemDetails: subject } = route.params;

  const [tests, setTests] = useState([]);
  const [preTest, setPreTest] = useState(null);
  const [postTest, setPostTest] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTests = useCallback(async () => {
    try {
      const response = await fetchAllTests();
      setTests(response.data);
    } catch (error) {
      console.error('Error loading tests:', error);
    }
  }, []);

  const getTest = (testType) => {
    return tests.find(
      (test) => test?.test_subject?._id  === subject?.course_id && test?.test_lesson?._id === subject?._id && test?.test_type === testType
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
  console.log("subject Id", subject._id)

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
          'PRE-Test',
          require('../assets/images/test.png'),
          () =>
            preTest
              ? handleNavigation('TestScreen', { test: preTest })
              : showToast('PRE-Test is disabled'),
          !preTest || preTest.test_status === 'disabled'
        )}

        {renderCard(
          'POST-Test',
          require('../assets/images/afterTest.jpg'),
          () =>
            postTest
              ? handleNavigation('TestScreen', { test: postTest })
              : showToast('POST-Test is disabled'),
          !postTest || postTest.test_status === 'disabled'
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

export default LessonHubScreen;
