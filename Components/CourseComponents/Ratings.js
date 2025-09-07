import { View, Text, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Rating } from 'react-native-ratings'; // Note: Not used here, so you can remove this import
import Svg, { Path } from 'react-native-svg';
import { colorPalette } from '../../assets/styles/Colors';
import { fetchUserById } from '../../API_STORE/user_api';

const Ratings = ({ ratings, page = 'main' }) => {
    const [rating, setRating] = useState(3.5);
    const [users, setUsers] = useState({});

    useEffect(() => {
        if (ratings && ratings.length > 0) {
            const totalRating = ratings.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = totalRating / ratings.length;
            setRating(avgRating);
        } else {
            setRating(3.5);
        }
    }, [ratings]);

    // Fetch user data only when necessary
    const fetchUserData = async (user_id) => {
        try {
            const fetchedUser = await fetchUserById({ user_id });
            setUsers((prevUsers) => ({ ...prevUsers, [user_id]: fetchedUser }));
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        // Fetch user data for each rating when the component is mounted
        if (ratings && ratings.length > 0) {
            ratings.forEach((item) => {
                if (!users[item.user]) {
                    fetchUserData(item.user); // Only fetch if user data is not already fetched
                }
            });
        }
    }, [ratings]);

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5 }}>
                {/* Conditional rendering based on `page` */}
                {page === 'CourseDetailPage' ? (
                    // Main page view
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 15 }}>
                            <View style={{ backgroundColor: colorPalette.aliceBlue, padding: 10, borderRadius: 5 }}>
                                <Text style={{ alignSelf: 'center', marginTop: 2, fontSize: 30, fontWeight: '500', color: '#85db51' }}>
                                    {rating.toFixed(1)}
                                </Text>
                            </View>
                            <View>
                                <Rating
                                    type="custom"
                                    ratingCount={5}
                                    imageSize={16}
                                    readonly
                                    startingValue={rating}
                                    ratingColor="gold"
                                    ratingBackgroundColor="#f7f7f7"
                                    style={{ paddingVertical: 10 }}
                                />
                                <Text style={{ alignSelf: 'center' }}>{ratings.length || 45} Reviews</Text>
                            </View>
                        </View>
                        <View>
                            <View style={{ marginTop: 5 }}>
                                <FlatList
                                    data={ratings}
                                    keyExtractor={(item) => item._id}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    renderItem={({ item }) => (
                                        <View
                                            style={{
                                                width: '100%',
                                                borderRadius: 12,
                                                backgroundColor: '#fff',
                                                padding: 14,
                                                marginVertical: 8,
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.08,
                                                shadowRadius: 4,
                                                elevation: 3,
                                            }}
                                        >
                                            {/* User Name */}
                                            <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6, color: '#222' }}>
                                                {users[item.user] ? users[item.user].username : 'Loading...'}
                                            </Text>

                                            {/* Star Rating */}
                                            <Rating
                                                type="custom"
                                                ratingCount={5}
                                                imageSize={18}
                                                readonly
                                                startingValue={item.rating}
                                                ratingColor="gold"
                                                ratingBackgroundColor="#ddd"
                                                style={{ marginBottom: 6, alignSelf: 'flex-start' }}
                                            />

                                            {/* Comment */}
                                            <Text style={{ fontSize: 14, color: '#444', lineHeight: 20 }}>
                                                {item.comment}
                                            </Text>
                                        </View>
                                    )}
                                />

                            </View>
                        </View>
                    </View>
                ) : (
                    // Non-main page view
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colorPalette.transBlue, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5, marginVertical: 3 }}>
                        <Svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#85db51" viewBox="0 0 16 16">
                            <Path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </Svg>
                        <Text style={{ alignSelf: 'center', marginTop: 2 }}>{rating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Ratings;
