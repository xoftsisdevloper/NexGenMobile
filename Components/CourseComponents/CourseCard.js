import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import { CourseCardFullBlock, CourseCardStyle } from '../../assets/styles/Styles';
import { useNavigation } from '@react-navigation/native';
import Ratings from './Ratings';

export const CourseCard = ({ course, showType = 'normal', courses }) => {
    const navigation = useNavigation();
    let content = null;

    switch (showType) {
        case 'fullBlock':
            content = (
                <View style={{ flexDirection: 'row', gap: 3 }}>
                    <View style={CourseCardFullBlock.cardContent}>
                        <Text style={CourseCardFullBlock.cardTitle}>{course.name}</Text>
                        <Text style={CourseCardFullBlock.cardText} numberOfLines={2}>{course.description}</Text>
                        <Ratings ratings={course.ratings} />
                    </View>
                    <View style={CourseCardFullBlock.fullBlockImage}>
                        <Image
                            source={{ uri: course.imageUrl }}
                            style={CourseCardFullBlock.cardImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>
            );
            break;

        case 'default':
            content = (
                <View style={{ marginBottom: 10 }}>
                    <Image
                        source={{ uri: course.imageUrl }}
                        style={CourseCardStyle.cardImage}
                        resizeMode="cover"
                    />
                    <View style={CourseCardStyle.cardContent}>
                        <Text style={CourseCardStyle.cardTitle}>{course.name}</Text>
                        <Ratings ratings={course.ratings} page={'home-slider'} />
                    </View>
                </View>
            );
            break;
        case 'suggestionBlock':
            content = (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', gap: 3 }}>
                            <View style={CourseCardFullBlock.cardContent}>
                                <Text style={CourseCardFullBlock.cardTitle}>{item.name}</Text>
                                <Text style={CourseCardFullBlock.cardText} numberOfLines={2}>{item.description}</Text>
                                <Ratings ratings={item.ratings} />
                            </View>
                            <View style={CourseCardFullBlock.fullBlockImage}>
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={CourseCardFullBlock.cardImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                        )}
                />

            );
            break;

        default:
            content = (
                <View style={{ marginBottom: 10 }}>
                    <View style={CourseCardStyle.cardContent}>
                        <Text style={CourseCardStyle.cardTitle}>No Courses Found</Text>
                    </View>
                </View>
            );
    break;
    }

    return (
        <TouchableOpacity onPress={() => navigation.navigate('CourseDetailScreen', { course: course, courses: courses })}>
            <Card containerStyle={showType === 'fullBlock' ? CourseCardFullBlock.cardContainer : CourseCardStyle.cardContainer}>
                {content}
            </Card>
        </TouchableOpacity>
    );
};

export default CourseCard;
