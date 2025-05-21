import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colorPalette } from '../assets/styles/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchleaderBoardForTest } from '../API_STORE/test_api';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../Navigation/AuthContext';

const ResultScreen = () => {
  const resultData = {
    overallScore: '3.35/100',
    nationalRank: '429/1024',
    bestScore: '52.69',
    percentile: '58.2%',
    averageScore: '4.4',
    accuracy: '44.44',
    positiveMarks: '6.0',
    negativeMarks: '2.64',
    unattempted: '56',
    correct: '4',
    wrong: '5',
    finalScore: `${"3.36/100"}/100`,
  };

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
        <Text style={{ marginHorizontal: 10, fontSize: 30, fontWeight: 'bold' }}>
          <Svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
  <Path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
</Svg>
        </Text>
      </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const route = useRoute();
  const { result } = route.params || {};
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  React.useEffect(() => {
    const updateLeaderboard = async () => {
      const data = await fetchleaderBoardForTest(result.test);
      setLeaderboardData(data);
    };

    if (result?.test) {
      updateLeaderboard();
    }
  }, [result?.test]);
  // const currentUser = '';
  const {authUser} = useAuth();
  console.log("AuthSUEr", authUser);
  
  const currentUserRank = leaderboardData?.data?.rankings?.find((item) => item.user?._id === authUser?._id)?.rank || 0;
  console.log("leader", result);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        /* Header */
        <View style={styles.header}>
          {/* <Text style={styles.headerTitle}>Result</Text> */}
        </View>

        /* Score Grid */
        <View style={styles.scoreGrid}>
          <ScoreCard label="Your Score" value={`${parseInt(result.score)}`} bgColor="#219653" />
          <ScoreCard label="Rank" value={parseInt(currentUserRank)} bgColor="#f2994a" />
          <ScoreCard label="Best Score" value={parseInt(leaderboardData?.data?.best_score || 0)} bgColor="#f2c94c" />
          <ScoreCard label="Percentile" value={`${parseInt(result.average_score)}%`} bgColor="#2f80ed" />
        </View>


        <Text style={styles.marksHeader}>Marks</Text>
        <View style={styles.marksGrid}>
          <MarksBox label="Positive" value={result.score} bgColor="#e6ffe6" borderColor="#27ae60" />
          <MarksBox label="Negative" value={result.negative_mark || '0'} bgColor="#ffe6e6" borderColor="#eb5757" />
          <MarksBox label="Unattempted" value={result.skipped_questions} bgColor="#ffd29c" borderColor="#bdbdbd" />
          <MarksBox label="Correct" value={result.correct_answers} bgColor="#d4edda" borderColor="#27ae60" />
          <MarksBox label="Wrong" value={result.wrong_answers} bgColor="#f8d7da" borderColor="#eb5757" />
          <MarksBox label="Final" value={`${parseInt(result.average_score)}/100`} bgColor="#e9ecef" borderColor="#bdbdbd" />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.compareButton} onPress={() => navigation.navigate('ComparisonScreen', { result: leaderboardData, testData: result })}>
            <Text style={styles.buttonText}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.solutionButton} onPress={() => navigation.navigate('SolutionScreen', { testData: result })}>
            <Text style={[styles.buttonText, { color: colorPalette.blue }]}>Solutions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ScoreCard = ({ label, value, bgColor, full }) => (
  <View style={[styles.scoreItem, { backgroundColor: bgColor, width: full ? '100%' : '48%' }]}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <Text style={styles.scoreValue}>{value}</Text>
  </View>
);

const MarksBox = ({ label, value, bgColor, borderColor, full }) => (
  <View style={[styles.marksItem, { backgroundColor: bgColor, borderColor, width: full ? '100%' : '30%' }]}>
    <Text style={styles.marksLabel}>{label}</Text>
    <Text style={styles.marksValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollContent: { padding: 15, paddingBottom: 100 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  scoreItem: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  scoreLabel: { fontSize: 14, color: '#fff', fontWeight: '600', marginBottom: 5 },
  scoreValue: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  marksHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  marksGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  marksItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marksLabel: { fontSize: 13, color: '#555', marginBottom: 5 },
  marksValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  compareButton: {
    backgroundColor: '#0052cc',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  solutionButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0052cc',
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: colorPalette.white,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabItem: { alignItems: 'center' },
  tabText: { fontSize: 12, marginTop: 3 },
});

export default ResultScreen;
