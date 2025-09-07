import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, FlatList, Modal, Image, ActivityIndicator } from 'react-native';
import { colorPalette } from '../assets/styles/Colors'; // Assuming this exists
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../Navigation/AuthContext';
import { getAllTestSubmission, submitTestData } from '../API_STORE/test_api';
import Toast from 'react-native-toast-message';
import RenderHTML from 'react-native-render-html';

// Mock data representing a test with multiple-choice questions
const mockTestData = {
    _id: '67966869860609606900',
    test_name: 'Social Lesson 1 Test',
    test_type: 'pre-test',
    test_subject: '67a960b43278b5da666e51a1', // Subject ID
    test_lesson: '67eb8524ed454ae828568b37',   // Lesson ID
    test_questions: [
        {
            _id: '4t43tu0tu3jut095u0ty509yu',
            question_text: 'This is the question data one',
            question_lang: 'en',
            question_options: { option_1: 'Option A', option_2: 'Option B', option_3: 'Option C', option_4: 'Option D' },
            correct_options: ['option_1'],
            question_type: 'MCQ',
            negative_mark: 0.3,
            positive_mark: 10,
        },
        {
            _id: 'another_question_id_1',
            question_text: 'Another question example.  Select one correct answer.',
            question_lang: 'en',
            question_options: { option_a: 'Choice A', option_b: 'Choice B', option_c: 'Choice C', option_d: 'Choice D' },
            correct_options: ['option_a'],
            question_type: 'MCQ',
            negative_mark: 0.5,
            positive_mark: 12,
        },
        {
            _id: 'another_question_id_2',
            question_text: 'Choose the correct option.',
            question_lang: 'en',
            question_options: { option_alpha: 'Alpha', option_beta: 'Beta', option_gamma: 'Gamma', option_delta: 'Delta' },
            correct_options: ['option_beta'],
            question_type: 'MCQ',
            negative_mark: 0.2,
            positive_mark: 8,
        },
        {
            _id: 'another_question_id_3',
            question_text: 'Select the single correct answer.',
            question_lang: 'en',
            question_options: { one: 'Number One', two: 'Number Two', three: 'Number Three', four: 'Number Four' },
            correct_options: ['two'],
            question_type: 'MCQ',
            negative_mark: 0.4,
            positive_mark: 11,
        },
        {
            _id: 'another_question_id_4',
            question_text: 'Pick the right choice.',
            question_lang: 'en',
            question_options: { first: 'First Choice', second: 'Second Choice', third: 'Third Choice', fourth: 'Fourth Choice' },
            correct_options: ['first'],
            question_type: 'MCQ',
            negative_mark: 0.1,
            positive_mark: 9,
        },
    ],
};



const TestScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { test } = route.params; // Assuming you pass the test data as a parameter
    // State to manage the current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // State to store the selected option for each question { questionIndex: selectedOptionKey }
    const [selectedOptions, setSelectedOptions] = useState({});
    // State to track the status of each question ('not_visited', 'answered', 'unanswered', 'marked_review', 'marked_review_answered')
    const [questionStatuses, setQuestionStatuses] = useState(Array(test.test_questions.length).fill('not_visited'));
    // State to track if a question is marked for review
    const [markedForReview, setMarkedForReview] = useState(Array(test.test_questions.length).fill(false));
    // State to control the visibility of the question palette modal
    const [isPaletteVisible, setIsPaletteVisible] = useState(false);
    // Total number of questions in the test
    const totalQuestions = test.test_questions.length;
    // Ref to the ScrollView to scroll to the top when navigating between questions
    const scrollViewRef = useRef();
    // Get the current question based on the current index
    const currentQuestion = test.test_questions[currentQuestionIndex];
    const { authUser } = useAuth();
    const [answers, setAnswers] = useState([]);
    const options = ["A", "B", "C", "D"];
    const [loading, setLoading] = useState(false);
    const [testTaken, setTestTaken] = useState(false);
    // useEffect to update the question status based on user interaction
    useEffect(() => {
        const newStatuses = [...questionStatuses];
        const isCurrentlyAnswered = !!selectedOptions[currentQuestionIndex];
        const isCurrentlyMarked = markedForReview[currentQuestionIndex];

        // Update status when a question is visited
        if (newStatuses[currentQuestionIndex] === 'not_visited') {
            newStatuses[currentQuestionIndex] = isCurrentlyAnswered ? 'answered' : 'unanswered';
            setQuestionStatuses(newStatuses);
        }
        // Update status when an option is selected or deselected
        else if (isCurrentlyAnswered) {
            newStatuses[currentQuestionIndex] = isCurrentlyMarked ? 'marked_review_answered' : 'answered';
            setQuestionStatuses(newStatuses);
        } else {
            newStatuses[currentQuestionIndex] = isCurrentlyMarked ? 'marked_review' : 'unanswered';
            setQuestionStatuses(newStatuses);
        }
    }, [questionStatuses]);

    // Function to handle navigation to the next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
    };

    // Function to handle navigation to the previous question
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
    };

    // Function to handle the selection of an option for the current question
    const handleOptionSelect = (optionKey) => {

        setSelectedOptions({ ...selectedOptions, [currentQuestionIndex]: optionKey });
        setAnswers([
            ...answers,
            {
                question: currentQuestion._id,
                question_status: questionStatuses[currentQuestionIndex],
                selected_option: optionKey,
                correct_option: currentQuestion.correct_options,
            },
        ]);
    };

    // Function to handle marking the current question for review
    const handleMarkForReview = () => {
        const newMarkedForReview = [...markedForReview];
        newMarkedForReview[currentQuestionIndex] = !newMarkedForReview[currentQuestionIndex];
        setMarkedForReview(newMarkedForReview);
    };

    // Function to navigate to a specific question from the sidebar
    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        setIsPaletteVisible(false); // Close the palette after navigation
    };

    // Function to count the number of questions with a specific status
    const countQuestions = (status) => {
        return questionStatuses.reduce((count, s, index) => {
            const isAnswered = !!selectedOptions[index];
            const isMarked = markedForReview[index];

            if (status === 'answered' && isAnswered && !isMarked) {
                return count + 1;
            }
            if (status === 'unanswered' && !isAnswered && !isMarked && s !== 'not_visited') {
                return count + 1;
            }
            if (status === 'not_visited' && s === 'not_visited') {
                return count + 1;
            }
            if (status === 'marked_review' && isMarked && !isAnswered) {
                return count + 1;
            }
            if (status === 'review_with_answer' && isMarked && isAnswered) {
                return count + 1;
            }
            return count;
        }, 0);
    };

    // Render item for the question number list in the sidebar
    const renderQuestionNumber = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.questionNumberButton,
                index === currentQuestionIndex && styles.currentQuestionNumberButton,
                !!selectedOptions[index] && !markedForReview[index] && styles.answeredQuestionNumberButton,
                markedForReview[index] && !selectedOptions[index] && styles.markedQuestionNumberButton,
                markedForReview[index] && !!selectedOptions[index] && styles.markedAnsweredQuestionNumberButton,
                questionStatuses[index] === 'not_visited' && !selectedOptions[index] && styles.notVisitedQuestionNumberButton,
            ]}
            onPress={() => goToQuestion(index)}
        >
            <Text style={styles.questionNumberText}>{index + 1}</Text>
        </TouchableOpacity>
    );

    const CalculateScores = () => {
        let score = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let skippedQuestions = 0;
        let averageScore = 0;
        let submittedAt = new Date();
        let totalQuestions = test?.test_questions.length;
        let detailAnswer = [];
        let questionofAnswer = '';
        let negativemarks = 0;
        skippedQuestions = questionStatuses.filter(status => status === 'not_visited' || status === 'unanswered').length;
        answers?.map(answer => {
            questionofAnswer = test.test_questions.find(q => q._id === answer.question);

            if (answer.selected_option && answer.correct_option.includes(options[answer.selected_option])) {
                correctAnswers += 1;
                score += currentQuestion.positive_mark;
            } else if (answer.selected_option) {
                wrongAnswers += 1;
                if (score > 0) {
                    score -= currentQuestion.negative_mark;
                    negativemarks += currentQuestion.negative_mark;
                }
            }
        })
        const maxScore = test.test_questions.reduce((total, question) => total + question.positive_mark, 0);
        averageScore = (score / maxScore) * 100;
        detailAnswer = answers?.map(answer => {
            return {
                question_id: answer.question,
                selected_option: answer.selected_option,
                isCorrect: answer.correct_option.includes(options[answer.selected_option]),
            }
        });
        return { score, correctAnswers, wrongAnswers, skippedQuestions, averageScore, submittedAt, totalQuestions, detailAnswer, negativemarks };
    }

    const handleSubmit = async () => {

        const data = {
            user: authUser._id,
            test: test._id,
            subject: test.test_subject._id,
            lesson: test.test_lesson._id,
            score: CalculateScores().score,
            correct_answers: CalculateScores().correctAnswers,
            wrong_answers: CalculateScores().wrongAnswers,
            skipped_questions: CalculateScores().skippedQuestions,
            average_score: CalculateScores().averageScore,
            submitted_at: CalculateScores().submittedAt,
            total_questions: CalculateScores().totalQuestions,
            detailed_answers: CalculateScores().detailAnswer,
        }

        const data2 = {
            user: authUser._id,
            test: test._id,
            subject: test.test_subject._id,
            lesson: test.test_lesson._id,
            score: CalculateScores().score,
            correct_answers: CalculateScores().correctAnswers,
            wrong_answers: CalculateScores().wrongAnswers,
            skipped_questions: CalculateScores().skippedQuestions,
            average_score: CalculateScores().averageScore,
            submitted_at: CalculateScores().submittedAt,
            total_questions: CalculateScores().totalQuestions,
            detailed_answers: CalculateScores().detailAnswer,
            negative_mark: CalculateScores.negativemarks,
            test_data: test
        }

           if (!testTaken) {
             try {
                const response = await submitTestData(data);
                console.log('Test submitted successfully:', response);
                if (response.success) {
                    navigation.navigate('ResultScreen', { result: data2 });
                }
                else {
                    Toast.error("Error submitting test: ", response?.message)
                }
            } catch (error) {
                Toast.error(error?.message)
                console.error('Error submitting test:', error);
            }
            finally {
                setLoading(false);
            }
           }
           else {
            setLoading(false);
            navigation.navigate('ResultScreen', { result: data2 });
           }

        // try {
        //     const response = await submitTestData(data);
        //     console.log('Test submitted successfully:', response);
        //     if (response.success) {
        //         navigation.navigate('ResultScreen', { result: data2 });
        //     }
        //     else {
        //         Toast.error("Error submitting test: ", response?.message)
        //     }
        // } catch (error) {
        //     Toast.error(error?.message)
        //     console.error('Error submitting test:', error);
        // }
        // finally {
        //     setLoading(false);
        // }

    }

    useEffect(() => {
        const setTestTakenData = async () => {
            try {
                const response = await getAllTestSubmission();

                if (response?.success) {
                    const currentTestData = response.data.filter(
                        (submission) =>
                            submission.test._id === test._id && submission.user._id === authUser._id
                    );

                    if (currentTestData.length > 0) {
                        setTestTaken(true);
                    } else {
                        setTestTaken(false);
                    }
                } else {
                    console.warn("Failed to fetch submissions:", response?.message || "Unknown error");
                }
            } catch (error) {
                console.error("Error fetching test submissions:", error);
            }
        };

        if (test?._id && authUser?._id) {
            setTestTakenData();
        }
    }, [test?._id, authUser?._id]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{test?.test_name}</Text>
                <TouchableOpacity style={styles.paletteButton} onPress={() => setIsPaletteVisible(true)}>
                    <Text style={styles.paletteButtonText}>Palette</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                {/* Main content area for displaying the current question */}
                <ScrollView style={styles.questionContainer} ref={scrollViewRef}>
                    <View style={styles.questionWrapper}>
                        {/* Question information display */}
                        <View style={styles.questionInfoContainer}>
                            <Text style={styles.questionInfoText}>
                                Question {currentQuestionIndex + 1} / {totalQuestions}
                            </Text>
                        </View>

                        {/* Container for the actual test question and options */}
                        <View style={styles.testContainer}>
                            <RenderHTML
                                contentWidth={100}
                                source={{ html: currentQuestion?.question_text }}
                                baseStyle={styles.questionText}
                            />

                            {
                                Object.entries(currentQuestion?.question_options || {}).map(([key, value], index) => (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.optionButton,
                                            selectedOptions[currentQuestionIndex] === key && styles.selectedOptionButton,
                                        ]}
                                        onPress={() => handleOptionSelect(key)}
                                    >
                                        <View style={styles.radioOuter}>
                                            <View style={[
                                                styles.radioInner,
                                                selectedOptions[currentQuestionIndex] === key && styles.selectedRadioInner,
                                            ]} />
                                        </View>
                                        <RenderHTML
                                            contentWidth={100}
                                            source={{ html: value?.text }}
                                            baseStyle={styles.optionText}
                                        />
                                    </TouchableOpacity>
                                ))

                            }
                            <TouchableOpacity style={styles.markReviewButton} onPress={handleMarkForReview}>
                                <Text style={styles.markReviewButtonText}>
                                    {test[currentQuestionIndex] ? 'Unmark for Review' : 'Mark for Review'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Navigation buttons for moving between questions */}
                        <View style={styles.navigationContainer}>
                            <TouchableOpacity
                                style={[styles.navigationButton, currentQuestionIndex === 0 && styles.disabledButton]}
                                onPress={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                <Text style={styles.navigationButtonText}>Previous</Text>
                            </TouchableOpacity>
                            {currentQuestionIndex === totalQuestions - 1 ? (
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={async () => {
                                        setLoading(true)

                                        // Wait for 10 seconds before navigating to the result page
                                        await new Promise(resolve => setTimeout(resolve, 10000));

                                        // Call the handleSubmit function to navigate to the result page
                                        handleSubmit();
                                    }}
                                >
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.navigationButton} onPress={handleNextQuestion}>
                                    <Text style={styles.navigationButtonText}>Next</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Question Palette Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isPaletteVisible}
                    onRequestClose={() => setIsPaletteVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => setIsPaletteVisible(false)} style={styles.closeButton}>
                                <Image source={require('../assets/images/cancel.png')} style={styles.cancelImage} />
                            </TouchableOpacity>

                            {/* Legend */}
                            <View style={styles.statusLegend}>
                                {[
                                    { color: '#cccccc', label: 'Not visited' },
                                    { color: '#003f88', label: 'Answered' },
                                    { color: '#f39c12', label: 'Unanswered' },
                                    { color: '#00d5ff', label: 'Review' },
                                    { color: '#168aad', label: 'Review with Answer' },
                                ].map((item, index) => (
                                    <View key={index} style={styles.legendHolder}>
                                        <View style={[styles.legendItem, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendText}>{item.label}</Text>
                                    </View>
                                ))}
                                <Text>Questions</Text>
                            </View>

                            {/* Question Buttons */}
                            <FlatList
                                data={test?.test_questions}
                                renderItem={renderQuestionNumber}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={5}
                                contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={loading}
                    onRequestClose={() => setIsPaletteVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { width: 50, borderRadius: '50%', height: 50, padding: 0, justifyContent: 'center' }]}>
                            <ActivityIndicator size={'large'} color={colorPalette?.primary || 'navy'} style={styles.activityIndicator} />
                        </View>
                    </View>
                </Modal>
                {/* <Modal
                    animationType="fade"
                    transparent={true}
                    visible={false}
                    onRequestClose={() => setIsPaletteVisible(false)}

                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { width: 300, height: 300, padding: 0, justifyContent: 'center' }]}>

                            <View>
                                <Image source={require('../assets/images/already.jpg')} style={{ width: 150, height: 150, resizeMode: 'center' }} />
                            </View>
                            <View>
                                <Text style={{ width: '200', fontSize: 18, color: '#85db51', marginVertical: 10 }}>
                                    You already taken Test
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.navigationButton, { width: 200 }]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.navigationButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal> */}

            </View>
        </SafeAreaView>
    );
};

// Styles for the TestScreen components
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f8ff', // A softer background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        backgroundColor: colorPalette?.primary || 'navy',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colorPalette?.white || 'white',
    },
    paletteButton: {
        backgroundColor: colorPalette?.accent || 'green',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    paletteButtonText: {
        color: colorPalette?.white || 'white',
        fontWeight: 'bold',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column', // Changed to column for better layout
    },
    questionContainer: {
        flex: 1,
        padding: 20,
    },
    questionWrapper: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    questionInfoContainer: {
        marginVertical: 10,
        width: '100%',
        padding: 15,
        borderRadius: 8,
        backgroundColor: colorPalette?.primaryLight || '#3f51b5', // Lighter primary color
    },
    questionInfoText: {
        fontSize: 16,
        color: colorPalette?.white || 'white',
        fontWeight: '600',
    },
    testContainer: {
        width: '100%',
        backgroundColor: colorPalette?.white || 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colorPalette?.borderColor || '#ddd',
    },
    questionText: {
        fontSize: 18,
        color: colorPalette?.secondary || '#555',
        marginBottom: 15,
        lineHeight: 24,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colorPalette?.borderColor || '#ddd',
        borderRadius: 5,
        padding: 12,
        marginBottom: 10,
        backgroundColor: colorPalette?.white || 'white',
    },
    selectedOptionButton: {
        backgroundColor: colorPalette?.blueLight || '#e0f7fa',
        borderColor: colorPalette?.accent || '#00bcd4',
    },
    optionText: {
        fontSize: 16,
        color: colorPalette?.textColor || '#333',
        marginLeft: 15,
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colorPalette?.primary || 'navy',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: 'transparent',
    },
    selectedRadioInner: {
        backgroundColor: colorPalette?.primary || 'navy',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    navigationButton: {
        backgroundColor: colorPalette?.primary || 'navy',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: '48%',
        alignItems: 'center',
    },
    navigationButtonText: {
        color: colorPalette?.white || 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: colorPalette?.accent || 'green',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: '48%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: colorPalette?.white || 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: colorPalette?.disabled || '#ccc',
    },
    markReviewButton: {
        backgroundColor: colorPalette?.warning || '#ffc107',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    markReviewButtonText: {
        color: colorPalette?.white || 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorPalette?.blackTrans || 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: colorPalette?.white || 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colorPalette?.textColor || '#333',
        marginBottom: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
    },
    cancelImage: {
        width: 24,
        height: 24,
    },
    modelContentContainer: {
        width: '100%',
        alignItems: 'center',
    },
    statusLegend: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 15,
        gap: 10,
        width: '100%'
    },
    legendHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    legendItem: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5,
    },
    legendText: {
        fontSize: 14,
        color: colorPalette?.textColor || '#333',
    },
    statusCounts: {
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    statusText: {
        fontSize: 16,
        color: colorPalette?.textColor || '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    questionNumberButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colorPalette?.borderColor || '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        backgroundColor: 'rgb(125, 125, 125)'
    },
    currentQuestionNumberButton: {
        backgroundColor: colorPalette?.primary || 'navy',
        borderColor: colorPalette?.primary || 'navy',
    },
    answeredQuestionNumberButton: {
        backgroundColor: "#003f88",
        borderColor: colorPalette?.accent || '#00bcd4',
    },
    markedQuestionNumberButton: {
        backgroundColor: '#00d5ff',
        borderColor: colorPalette?.warning || '#ffc107',
    },
    markedAnsweredQuestionNumberButton: {
        backgroundColor: '#168aad',
        borderColor: colorPalette?.markedAnswered || '#aed581',
    },
    notVisitedQuestionNumberButton: {
        backgroundColor: '#cccccc',
    },
    questionNumberText: {
        fontSize: 16,
        color: colorPalette?.white || 'rgb(125, 125, 125)',
        fontWeight: '700'
    },
});

export default TestScreen;