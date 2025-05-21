import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Card } from 'react-native-elements';
import { CourseCardFullBlock, CourseCardStyle } from '../../assets/styles/Styles';
import { useNavigation } from '@react-navigation/native';
import Ratings from './Ratings';
import Svg, { Path } from 'react-native-svg';
import { colorPalette } from '../../assets/styles/Colors';

export const TeacherCourseCard = ({ course, showType = 'normal', courses }) => {
    const navigation = useNavigation();
    let content = null;
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const data = new Date(course.createdAt)
    const isNew = fiveDaysAgo <= data;

    const colorForCourseType = (courseType) => {
        switch (courseType) {
            case 'general':
                return 'rgba(27, 171, 1, 0.19)'; // Green
            case 'academic':
                return 'rgba(251, 160, 2, 0.43)'; // Orange
            case 'school':
                return 'rgba(2, 234, 251, 0.28)'; // Orange
            case 'college':
                return 'rgba(234, 251, 2, 0.32)';
            default:
                return '#000'; // Default color
        }
    };

    switch (showType) {
        case 'fullBlock':
            content = (
                <View style={[{ flexDirection: 'row', gap: course.isPending ? 0 : 3, }]}>
                    <View style={[CourseCardFullBlock.cardContent]}>
                        <Text style={CourseCardFullBlock.cardTitle}>{course.name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', columnGap: 5, flexWrap: 'wrap' }}>
                            <Ratings ratings={course.ratings} />
                            <View style={[CourseCardFullBlock.courseTypeTag, { backgroundColor: colorForCourseType(course.course_type), }]}>
                                <Text style={CourseCardFullBlock.courseTypeText}>
                                    {course.course_type || 'N/A'}
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={CourseCardFullBlock.fullBlockImage}>
                        <Image
                            source={{ uri: course.imageUrl }}
                            style={CourseCardFullBlock.cardImage}
                            resizeMode="cover"
                        />
                        {
                            isNew && (
                                <Image
                                    source={require('../../assets/images/new.png')}
                                    style={{ width: 35, height: 35, resizeMode: 'center', position: 'absolute', top: -20, right: -10 }}
                                    resizeMode="cover"
                                />
                            )
                        }
                    </View>

                </View>
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
        <TouchableOpacity onPress={() => navigation.navigate('ApprovalList', { course: course, courses: courses })} disabled={course.isPending}>
            <Card containerStyle={[showType === 'fullBlock' ? CourseCardFullBlock.cardContainer : CourseCardStyle.cardContainer]}>
                {content}

            </Card>
            {
                course.isPending && (
                    <View style={{ backgroundColor: "rgba(191, 191, 191, 0.47)", position: "absolute", top: 15, right: 0, width: "100%", height: 120, justifyContent: "center", alignItems: "center", padding: 0, borderRadius: 10 }}>
                        <Text style={{ fontSize: 14, padding: 10, backgroundColor: 'rgb(255, 221, 0)', borderRadius: 10, color: '#000', fontWeight: '700' }}> Approval Pending</Text>
                    </View>
                )
            }
        </TouchableOpacity>
    );
};

export default TeacherCourseCard;
