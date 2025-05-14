import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import TrophySVG from "../Components/CourseComponents/TrophySvg";
import { colorPalette } from "../assets/styles/Colors";
import { useAuth } from "../Navigation/AuthContext";
import { useRoute } from "@react-navigation/native";
import { fetchleaderBoardForTest } from "../API_STORE/test_api";

const visibleColors = [
    '#8B0000', '#2F4F4F', '#4B0082', '#00008B', '#006400',
    '#8B4513', '#2E8B57', '#483D8B', '#556B2F', '#191970',
    '#8B008B', '#800000', '#5F9EA0', '#6B8E23',
];

const LeaderboardSummary = () => {
    const [selectedTest, setSelectedTest] = useState("pre");
    const { authUser } = useAuth();
    const [currentUserId] = useState(authUser?._id);
    const route = useRoute();
    const { pre_test, post_test } = route?.params || {};
    const [preTestData, setPreTestData] = useState(pre_test || {});
    const [postTestData, setPostTestData] = useState(post_test || {});
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const updateLeaderboard = async () => {
            setLoading(true);
            setLeaderboardData(null);

            try {
                const testId = selectedTest === "pre" ? preTestData?._id : postTestData?._id;

                if (!testId) {
                    setLeaderboardData({
                        best_score: 0,
                        rankings: [],
                    });
                    return;
                }

                const response = await fetchleaderBoardForTest(testId);

                if (response?.data?.rankings?.length > 0) {
                    setLeaderboardData(response.data);
                } else {
                    setLeaderboardData({
                        best_score: 0,
                        rankings: [],
                    });
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
                setLeaderboardData({
                    best_score: 0,
                    rankings: [],
                });
            } finally {
                setLoading(false);
            }
        };

        updateLeaderboard();
    }, [selectedTest, preTestData, postTestData]);

    const topper = leaderboardData?.rankings?.[0] || null;
    const currentUser = leaderboardData?.rankings?.find(item => item.user._id === currentUserId) || null;

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f9fbfd', padding: 20 }}>
            {/* Test Switch Buttons */}
            <View style={styles.testSwitch}>
                <TouchableOpacity
                    style={[styles.testButton, selectedTest === "pre" && styles.testButtonSelected]}
                    onPress={() => setSelectedTest("pre")}
                >
                    <Text style={styles.testButtonText}>Pre-Test</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.testButton, selectedTest === "post" && styles.testButtonSelected]}
                    onPress={() => setSelectedTest("post")}
                >
                    <Text style={styles.testButtonText}>Post-Test</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={{ marginTop: 10 }}>Loading Leaderboard...</Text>
                </View>
            ) : (
                leaderboardData && (
                    <>
                        <View style={[styles.card, styles.topScoreCard]}>
                            <View style={styles.rowCenter}>
                                <Text style={[styles.title, { width: '55%' }]}>Best Score:</Text>
                                <Text style={[styles.info, { width: '30%' }]}>{leaderboardData.best_score}</Text>
                            </View>
                        </View>

                        <View style={styles.container}>
                            {topper && (
                                <View style={[styles.card, styles.topperCard]}>
                                    <Text style={styles.title}>Topper</Text>
                                    <TrophySVG value={topper.rank} size={100} />
                                    <Text style={styles.info}>Rank: {topper.rank}</Text>
                                    <Text style={styles.info}>Score: {topper.score}</Text>
                                </View>
                            )}

                            {currentUser && (
                                <View style={[styles.card, styles.currentUserCard]}>
                                    <Text style={styles.title}>You</Text>
                                    <TrophySVG value={currentUser.rank} size={100} color={"#0147ab"} />
                                    <Text style={[styles.info, { backgroundColor: '#0147ab' }]}>Rank: {currentUser.rank}</Text>
                                    <Text style={[styles.info, { backgroundColor: '#0147ab' }]}>Score: {currentUser.score}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.leaderListContainer}>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerText}>Ranks</Text>
                                <Text style={styles.headerText}>Scores</Text>
                            </View>

                            {leaderboardData.rankings.length === 0 ? (
                                <Text style={{ textAlign: 'center', color: '#777', padding: 10 }}>
                                    No leaderboard data available for this test.
                                </Text>
                            ) : (
                                <FlatList
                                    data={leaderboardData.rankings}
                                    keyExtractor={(item) => item.user._id}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.leaderRow}>
                                            <View style={styles.rankInfo}>
                                                <TrophySVG value={item.rank} size={50} color={visibleColors[index % visibleColors.length]} />
                                                <Text style={styles.rankText}>Rank {item.rank}</Text>
                                            </View>
                                            <Text style={styles.rankText}>{item.score}</Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </>
                )
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: 5
    },
    card: {
        padding: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 4,
        width: 160,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topScoreCard: {
        width: '100%',
        backgroundColor: 'rgb(231, 255, 233)',
        marginBottom: 20,
        padding: 10
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    topperCard: {
        backgroundColor: "#fff7e6",
    },
    currentUserCard: {
        backgroundColor: "#e6f7ff",
    },
    info: {
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'gold',
        padding: 6,
        borderRadius: 6,
        color: '#fff',
        fontWeight: '700',
        marginTop: 5
    },
    leaderListContainer: {
        paddingVertical: 10,
        backgroundColor: colorPalette.transBlue,
        borderRadius: 10,
        marginTop: 20
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: colorPalette.aliceBlue,
        borderRadius: 5
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colorPalette.textgreen
    },
    leaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 10
    },
    rankInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colorPalette.textgreen,
        marginLeft: 10
    },
    testSwitch: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20
    },
    testButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#ddd',
        width: 150,
        minHeight: 50,
        justifyContent: 'center', alignItems: 'center'
    },
    testButtonSelected: {
        backgroundColor: '#0147ab'
    },
    testButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18
    }
});

export default LeaderboardSummary;
