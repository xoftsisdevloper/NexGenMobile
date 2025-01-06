import React, { useState, useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DescriptionScreen from '../../Screens/CourseCompoScreens/DescriptionScreen';
import SubjectsScreen from '../../Screens/CourseCompoScreens/SubjectsScreen';
import ReviewScreen from '../../Screens/CourseCompoScreens/ReviewScreen';
import { colorPalette } from '../../assets/styles/Colors';

function TabViewExample({ courseData }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0); 

  const renderScene = SceneMap({
    first: () => <DescriptionScreen courseData={courseData} />,
    second: () => <SubjectsScreen courseData={courseData} />,
    third: () => <ReviewScreen courseData={courseData} />,
  });

  const formatTabTitle = (title, count) => {
    return `${title} (${count || 0})`;
  };

  const routes = [
    { key: 'first', title: 'Description' },
    {
      key: 'second',
      title: formatTabTitle('Subjects', courseData?.subjects?.length),
    },
    {
      key: 'third',
      title: formatTabTitle('Reviews', courseData?.ratings?.length),
    },
  ];

  const handleIndexChange = useCallback((newIndex) => {
    setIndex(0); 
  }, []); 

  return (
    <View style={{ flex: 1 }}> {/* Ensure the TabView has enough space */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#0147ab' }}
            inactiveColor='#000'
            activeColor='#0147ab'
            style={{ backgroundColor: colorPalette.aliceBlue }}
          />
        )}
      />
    </View>
  );
}

export default TabViewExample;