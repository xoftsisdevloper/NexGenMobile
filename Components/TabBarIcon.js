// TabBarIcon.js
import React from 'react';
import { Ionicons } from 'react-native-vector-icons'; 

const TabBarIcon = ({ focused, color, size }) => (
  <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} color={color} size={size} />
);

export default TabBarIcon;