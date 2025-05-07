import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colorPalette } from '../assets/styles/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchleaderBoardForTest } from '../API_STORE/test_api';

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
  const route = useRoute();
  const {result} = route.params || {};
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
  
  const currentUserRank = leaderboardData?.data?.rankings?.find((item) => item.user_id === result.user_id)?.rank || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Result</Text>
        </View>

        {/* Score Grid */}
        <View style={styles.scoreGrid}>
          <ScoreCard label="Overall Score" value={`${result.average_score}/100`} bgColor="#219653" />
          <ScoreCard label="Rank" value={currentUserRank} bgColor="#f2994a" />
          <ScoreCard label="Best Score" value={leaderboardData?.data?.best_score || 'N/A'} bgColor="#f2c94c" />
          <ScoreCard label="Percentile" value={`${result.average_score}%`} bgColor="#2f80ed" />
        </View>

        {/* Marks Section */}
        <Text style={styles.marksHeader}>Marks</Text>
        <View style={styles.marksGrid}>
          <MarksBox label="Positive" value={result.score} bgColor="#e6ffe6" borderColor="#27ae60" />
          <MarksBox label="Negative" value={result.negative_mark || '0'} bgColor="#ffe6e6" borderColor="#eb5757" />
          <MarksBox label="Unattempted" value={result.skipped_questions} bgColor="#ffd29c" borderColor="#bdbdbd" />
          <MarksBox label="Correct" value={result.correct_answers} bgColor="#d4edda" borderColor="#27ae60" />
          <MarksBox label="Wrong" value={result.wrong_answers} bgColor="#f8d7da" borderColor="#eb5757" />
          <MarksBox label="Final" value={`${result.average_score}/100`} bgColor="#e9ecef" borderColor="#bdbdbd"  />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.compareButton} onPress={()=> navigation.navigate('ComparisonScreen', {result: leaderboardData, testData: result})}>
            <Text style={styles.buttonText}>Compare</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.solutionButton} onPress={()=> navigation.navigate('SolutionScreen', {testData: result})}>
            <Text style={[styles.buttonText, {color: colorPalette.blue}]}>Solutions</Text>
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
