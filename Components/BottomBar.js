import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen'; 
import CourseScreen from '../Screens/CourseDetailScreen'; 
import TabBarIcon from './TabBarIcon'; // Import the TabBarIcon component

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      {/* Add more screens as needed */}
    </Tab.Navigator>
  );
};

export default BottomBar;