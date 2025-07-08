import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import RenderHTML from 'react-native-render-html';
import { colorPalette } from '../assets/styles/Colors';

const LessonPlan = () => {
    const route = useRoute();
    const item = route.params?.item;
    console.log("Params of Lesson Plan : ", item);

    return (
        <View style={styles.container}>
            {/* <View >
                <Text style={styles.sectionTitle}>Lesson Objectives</Text>
            </View> */}
            <View >

                <RenderHTML
                    contentWidth={100}
                    source={{ html: item?.description }}
                    baseStyle={styles.sectionContent}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: colorPalette.aliceBlue,
        flex: 1
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'left',
        width: '100%',
    },

    sectionContent: {
        paddingHorizontal: 10,
        fontSize: 18,
        textTransform: 'capitalize'
    }
})
export default LessonPlan