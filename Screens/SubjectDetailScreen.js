import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

const SubjectDetailScreen = () => {
  const route = useRoute();
  const {subject} = route.params;  
  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{color: '#000'}}>{subject.description}</Text>
    </View>
  )
}

export default SubjectDetailScreen