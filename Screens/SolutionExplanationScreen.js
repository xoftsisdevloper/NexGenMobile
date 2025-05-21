import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

const SolutionExplanationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { question, answer, isCorrect } = route.params;
  console.log(route.params)
  const options = ['a', 'b', 'c', 'd'];
  console.log("the correct value", isCorrect);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Question Box */}
        <View style={styles.card}>
          <RenderHTML
            contentWidth={100}
            source={{ html: question?.question_text }}
            baseStyle={styles.questionText}
          />
          <Text style={styles.label}>Your Answer</Text>
            <RenderHTML
            contentWidth={100}
            source={{ html: `<span style="color: ${isCorrect ? '#219653' : '#ff0000'}; font-weight:'700'; font: 16px; text-transform: capitalize">${answer[0]}</span>` }}
            baseStyle={styles.answerText}
            />
            
            </View>
        <View style={styles.card}>
          <Text style={styles.solutionTitle}>Solution</Text>
          <Text style={styles.answerText}>
            The correct answer is <Text style={styles.linkText}>{question?.correct_options.map((opt) => {
              return opt;
            })}</Text>
          </Text>
          <Text style={styles.whyTitle}>Why</Text>
          <RenderHTML
            contentWidth={100}
            source={{ html: question?.solution }}
            baseStyle={styles.explanationText}
          />

        </View>

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
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backIcon: { fontSize: 24, marginRight: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  questionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 13, color: '#666' },
  answerText: { fontSize: 15, color: '#219653', fontWeight: 'bold' },

  solutionTitle: { color: '#2f80ed', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  correctAnswer: { fontSize: 15, marginBottom: 10 },
  linkText: { color: '#27ae60', fontWeight: 'bold' },
  whyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 5 },

  explanationText: { fontSize: 14, color: '#333', marginBottom: 8 },
  bullet: { fontSize: 14, paddingLeft: 10, marginBottom: 4 },

  backButton: {
    backgroundColor: '#0052cc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  tabItem: { alignItems: 'center' },
  tabText: { fontSize: 12 },
});

export default SolutionExplanationScreen;