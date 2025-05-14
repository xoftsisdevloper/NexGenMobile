import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

const mockQuestions = [
  { id: 1, status: 'Correct', question: 'Which of the following is the primary component of natural gas?', attempted: true },
  { id: 2, status: 'Wrong', question: 'Which of the following is the primary component of natural gas?', attempted: true },
  { id: 3, status: 'Unattempted', question: 'Which of the following is the primary component of natural gas?', attempted: false },
];

const getColorByStatus = (status) => {
  switch (status) {
    case 'Correct': return '#d4f8e8';
    case 'Wrong': return '#fddede';
    case 'Unattempted': return '#fdeacb';
    default: return '#fff';
  }
};

const SolutionsScreen = () => {
  const [questions, setQuestions] = React.useState([]);
  const [answered, setAnswered] = React.useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { testData } = route.params || {};
  const options = ['a', 'b', 'c', 'd'];
  useEffect(() => {
    setQuestions(testData?.test_data?.test_questions);
    setAnswered(testData?.detailed_answers);
  }, [questions]);

  const handleSolutionPress = (question) => {
    const answer = getAnswer(question._id).map((opt) => question.question_options[opt]?.text);
    navigation.navigate('SolutionExplainScreen', { question: question , answer: answer, isCorrect: getCorrect(question._id) }); // Make sure SolutionExplanation is registered in your stack
  };

  const getAtemptedOrnot = (questionId) => {
    return answered.some(answer => answer.question_id === questionId);
  }

  const isCorrectAnswet = (question) => {
    console.log("answered", answered.some(answer => answer.question_id === question._id && answer.isCorrect));
    return answered.some(answer => answer.question_id === question._id && answer.isCorrect);
  }

  const getAnswer = (question_id) => {
    console.log("answered", answered.find(answer => answer.question_id === question_id)?.selected_option);
    const selectedOption = answered.find(answer => answer.question_id === question_id)?.selected_option;
    return selectedOption ? [selectedOption] : [];
  }

  const getCorrectAnswer = (question_id) => {
    let isCorrect = false;
    let status = 'Unattempted';
    console.log("isCorrect", answered.some(answer => answer.question_id === question_id))
    if (answered.some(answer => answer.question_id === question_id)) {
      isCorrect = answered.filter(answer => answer.question_id === question_id)[0]?.isCorrect;
      status = isCorrect ? 'Correct' : 'Wrong';
    }

    return status;
  }
  const getCorrect = (question_id) => {
    let isCorrect = false;
    console.log("isCorrect", answered.some(answer => answer.question_id === question_id))
    if (answered.some(answer => answer.question_id === question_id)) {
      isCorrect = answered.filter(answer => answer.question_id === question_id)[0]?.isCorrect;
     
    }
    return isCorrect;
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Status Boxes */}
        <View style={styles.statusRow}>
          <View style={[styles.statusBox, { backgroundColor: 'hsl(66, 100.00%, 43.70%)' }]}>
            <Text style={styles.statusText}>{`Total Questions (${testData?.total_questions})`}</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: '#27ae60' }]}>
            <Text style={styles.statusText}>{`Correct (${testData?.correct_answers})`}</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: '#eb5757' }]}>
            <Text style={styles.statusText}>{`Wrong (${testData?.wrong_answers})`}</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: '#f2994a' }]}>
            <Text style={styles.statusText}>{`Un Attempted (${testData?.skipped_questions})`}</Text>
          </View>
        </View>

        {/* Questions */}
        {questions.map((q, index) => (
          <TouchableOpacity key={q._id} onPress={() => handleSolutionPress(q)}>
            <View style={[styles.questionCard, { backgroundColor: getColorByStatus(getCorrectAnswer(q._id)) }]}>
              <View style={styles.attemptedLabel(getAtemptedOrnot(q._id))}>
                <Text style={styles.attemptedText}>
                  {getAtemptedOrnot(q._id) ? 'Attempted' : 'Unattempted'}
                </Text>
              </View>
              <Text style={styles.tabText}>Question: {index + 1}</Text>

              <RenderHTML
            contentWidth={100}
            source={{ html: q?.question_text }}
            baseStyle={styles.questionText}
          />
              {(getAnswer(q._id) || []).map((opt, idx) => (
                <View>
                  <Text style={styles.tabText}>Your Answer</Text>
                  <RenderHTML
            contentWidth={100}
            source={{ html: `${q.question_options[opt]?.text}` }}
            baseStyle={styles.optionText}
          />
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 15, paddingBottom: 100 },
  statusRow: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  statusBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: { color: '#fff', fontWeight: 'bold' },
  questionCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  attemptedLabel: (attempted) => ({
    backgroundColor: attempted ? '#2f80ed' : '#f2994a',
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  }),
  attemptedText: { color: '#fff', fontSize: 12 },
  questionText: { fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  optionText: { fontSize: 13, paddingLeft: 5, marginBottom: 4, fontWeight: '700' },
  backButton: {
    backgroundColor: '#0147ab',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabItem: { alignItems: 'center' },
  tabText: { fontSize: 12, lineHeight: 20, marginBottom: 5, fontWeight: '700', color: '#0147ab' },
});

export default SolutionsScreen;
