import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../Navigation/AuthContext';
import { getAllTestSubmission } from '../API_STORE/test_api';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;

const ComparisonScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([0, 0, 0]); // Default data for the chart
  const route = useRoute();
  const { result, testData } = route.params || {};
  const [leaderboardData, setLeaderboardData] = useState(result?.data);
  const [score, setScore] = useState([0, 0, 0]); // Default score
  const [correctCount, setCorrectCount] = useState([0, 0, 0]); // Default score
  const [incorrectCount, setinCorrectCount] = useState([0, 0, 0]); // Default score
  const [activeIndex, setActiveIndex] = useState(0); // Default active index for comparison buttons
  const [getAllTest, setAllTest] = useState([]);
  const { authUser } = useAuth();

  const defaultChartData = {
    labels: ['You', 'Topper', 'Average'],
    datasets: [
      {
        data: data,
      },
    ],
  };

  useEffect(async () => {
    try {
      const testst = await getAllTestSubmission();
      setAllTest(testst)
    } catch (error) {
      Toast.error(
        `This is the error: ${error}`
      )
    }
  }, [])
  
  const setScoreData = () => {
    const currentUserScore =
      leaderboardData?.rankings?.filter((item) => item.user_id === authUser?.user_id)[0]?.score || 0;
    const topperScore = leaderboardData?.best_score || 0;
    let average_score = 0;
    leaderboardData?.rankings?.forEach((item) => {
      average_score += item.score;
    });
    const calculatedScore = [
      currentUserScore.toFixed(1),
      topperScore.toFixed(1),
      (average_score / leaderboardData?.rankings?.length).toFixed(1),
    ];
    setScore(calculatedScore);
    setData(calculatedScore); // Update the chart data
  };



  useEffect(() => {
    setScoreData(); // Call setScoreData when the component mounts
  }, [leaderboardData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Result</Text>
        <View style={styles.chartBox}> 
          <BarChart
            data={defaultChartData}
            width={screenWidth - 40}
            height={250}
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: () => '#0147ab',
              barPercentage: 1.5,
              barRadius: 5,
              labelColor: () => '#0147ab',
              propsForLabels: {
                fontSize: 12,
                color: '#fff',
              },
            }}
            showValuesOnTopOfBars
            withInnerLines={false}
          />
        </View>

        {/* Comparison Buttons */}
        <View style={styles.buttonGrid}>
          
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 15, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2f80ed', marginVertical: 10, width: '100%' },
  chartBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
    columnGap: 10,
  },
  compButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    width: '30%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  buttonText: { color: '#000', fontWeight: '600' },
  activeButtonText: { color: '#fff' },
  backButton: {
    backgroundColor: '#0052cc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ComparisonScreen;
