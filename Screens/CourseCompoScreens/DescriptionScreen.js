import { View, Text, StyleSheet, ScrollViewComponent } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { CourseCardStyle } from '../../assets/styles/Styles'

export default function DescriptionScreen({ courseData }) {

  return (
    <View style={styles.mainContainer} >
      <ScrollView>
        <View style={styles.textContainer}>
          <View style={CourseCardStyle.cardDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0147ab" class="bi bi-alarm-fill" viewBox="0 0 16 16" style={{ marginRight: 5 }}>
                <Path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527" />
              </Svg>
              <Text style={CourseCardStyle.cardDetailText}> {courseData.duration} Hours</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#0147ab" class="bi bi-book-half" viewBox="0 0 16 16" style={{ marginRight: 5 }}>
                <Path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
              </Svg>
              <Text style={CourseCardStyle.cardDetailText}> {courseData.subjects.length} Subjects</Text>
            </View>
          </View>
          <Text style={styles.title}>Description:</Text>
          <Text>{courseData.description}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  title: {
    fontWeight: '700',
    marginBottom: 5,
    fontSize: 16,
  },

  textContainer: {
    padding: 15
  }
})