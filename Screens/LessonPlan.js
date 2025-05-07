import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const LessonPlan = () => {
    const route = useRoute();
    const item = route.params?.item;
    console.log("Params of Lesson Plan : ", item);
    
    return (
        <View style={styles.container}>
            <View >
                <Text style={styles.sectionTitle}>Lesson Objectives</Text>
            </View>
            <View >
                <Text style={styles.sectionContent}>{item.description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
        width: '100%',
    },

    sectionContent: {
        padding: 10,
        fontSize: 16,
    }
})
export default LessonPlan