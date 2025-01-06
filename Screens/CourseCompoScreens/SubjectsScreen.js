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

export const SubjectsScreen = ({ courseData }) => {
  const navigation = useNavigation();

  const renderSubject = (item, index) => (
    <CollapsibleView title={item.name} index={index}>
      <View style={styles.subjectContainer}>
        {item.materials.length > 0 && (
          <View style={styles.unitsContainer}>
            <Text style={styles.unitTitle}>Lessons</Text>
            <FlatList
              data={item.materials}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('MaterialScreen', { item })}
                  style={styles.unitList}
                >
                  <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.lesson}>Lesson {index + 1} : </Text>
                  </View>
                  <View style={{ alignSelf: 'center', flex: 1 }}>
                    <Text style={styles.unitItem}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        
        <Text style={styles.subjectTitle}>Description</Text>
        <Text style={styles.subjectDescription}>{item.description}</Text>
      </View>
    </CollapsibleView>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.textContainer}>
          <View style={styles.vieeDesign}>
            <Text style={styles.title}>Subjects:</Text>
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
    padding: 5,
  },

  subjectTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subjectDescription: {
    marginBottom: 10,
  },

  unitItem: {
    padding: 5,
    flexWrap: 'wrap'
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
    color: '#0147ab',
    padding: 5,
  }
});

export default SubjectsScreen;
