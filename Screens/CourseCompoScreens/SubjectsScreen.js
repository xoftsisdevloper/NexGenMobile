import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CollapsibleView from '../../Components/CourseComponents/Collapse';
import { CourseCardStyle } from '../../assets/styles/Styles';
import Svg, { Path } from 'react-native-svg';
import { colorPalette } from '../../assets/styles/Colors';
import { useAuth } from '../../Navigation/AuthContext';

export const SubjectsScreen = ({ courseData }) => {
  const navigation = useNavigation();
  const {authUser} = useAuth();
  const renderSubject = (item, index) => (
    <View>
      <View style={styles.subjectContainer}>
        <TouchableOpacity
          onPress={() =>{authUser?.role === 'student' ?  navigation.navigate('LessonHub', { itemDetails: item }) : navigation.navigate('TeacherLessonHub', { itemDetails: item }) }}
          style={styles.unitList}
        >
          <View style={{ alignSelf: 'center', backgroundColor: colorPalette.blue, height: '100%', justifyContent: 'center', alignItems: 'center', width: '20%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
            <Text style={[styles.lesson, { fontSize: 16, fontWeight: '700' }]}>Ch-{index + 1}</Text>
          </View>
          <View style={{ alignSelf: 'center', flex: 1 }}>
            <Text style={styles.unitItem}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.textContainer}>
          <View style={styles.vieeDesign}>
          </View>
          <FlatList
            data={courseData.subjects}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index }) => renderSubject(item, index)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  title: {
    fontWeight: '700',
  },

  textContainer: {
    padding: 20,
  },

  vieeDesign: {
    marginBottom: 10,
  },

  subjectContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  unitContainer: {
    marginTop: 10,
  },

  unitList: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: colorPalette.aliceBlue,
    borderRadius: 5,
    height: 100
  },

  subjectTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subjectDescription: {
    marginBottom: 10,
  },

  unitItem: {
    paddingHorizontal: 15,
    flexWrap: 'wrap',
    fontSize: 16,
    paddingVertical: 10,
    lineHeight: 22,
    textAlign: 'left'
  },

  unitTitle: {
    fontWeight: 'bold',
  },

  notFound: {
    color: '#b6bab7',
    paddingVertical: 15,
    textAlign: 'center',
    fontStyle: 'italic'
  },

  lesson: {
    color: colorPalette.white,
    padding: 5,
  }
});

export default SubjectsScreen;
