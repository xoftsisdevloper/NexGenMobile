import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { CourseCardFullBlock, CourseCardStyle } from '../../assets/styles/Styles';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, createStaticNavigation } from '@react-navigation/native';
import CourseDetailScreen from '../../Screens/CourseDetailScreen';
import { Rating } from 'react-native-ratings';
import Ratings from './Ratings';

export const CourseCard = ({ course, showType = 'normal' }) => {

    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('CourseDetailScreen', { course: course })} >
            <Card containerStyle={showType === 'fullBlock' ? CourseCardFullBlock.cardContainer : CourseCardStyle.cardContainer}>

                {
                    showType === 'fullBlock' ? (

                        <View style={{ flexDirection: 'row', gap: 5, }}>

                            <View style={CourseCardFullBlock.cardContent}>
                                <Text style={CourseCardFullBlock.cardTitle}>{course.name}</Text>
                                <Text style={CourseCardFullBlock.cardText} numberOfLines={1}>{course.description}</Text>
                                <Ratings ratings = {course.ratings}/>
                            </View>
                            <View style={CourseCardFullBlock.fullBlockImage}>
                                <Image
                                    source={{ uri: course.imageUrl }}
                                    style={showType === 'fullBlock' ? CourseCardFullBlock.cardImage : CourseCardStyle.cardImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginBottom: 10 }}>
                            <Image
                                source={{ uri: course.imageUrl }}
                                style={showType === 'fullBlock' ? CourseCardFullBlock.cardImage : CourseCardStyle.cardImage}
                                resizeMode="cover"
                            />
                            <View style={showType === 'fullBlock' ? CourseCardFullBlock.cardContent : CourseCardStyle.cardContent}>
                                <Text style={showType === 'fullBlock' ? CourseCardFullBlock.cardTitle : CourseCardStyle.cardTitle}>{course.name}</Text>
                                <Ratings ratings = {course.ratings} page={'home-slider'}/>
                            </View>
                        </View>
                    )

                }
            </Card>
        </TouchableOpacity>
    );
};

export default CourseCard;
