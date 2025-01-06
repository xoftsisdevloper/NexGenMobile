import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import CourseDetailScreen from '../Screens/CourseDetailScreen';
import MaterialScreen from '../Screens/MaterialScreen';
import Svg, { Path } from 'react-native-svg';
import SubjectDetailScreen from '../Screens/SubjectDetailScreen';
import { colorPalette } from '../assets/styles/Colors';
import SearchScreen from '../Screens/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShadowVisible: false, title: 'Explore', headerLargeTitle: true,}} />
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
      <Stack.Screen name="SubjectDetailScreen" component={SubjectDetailScreen} options={{ title: 'Subjects Details' }} />
      <Stack.Screen name="MaterialScreen" component={MaterialScreen} options={{ title: 'Material' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search', }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShadowVisible: false, title: 'Explore', headerTitleAlign: 'center', headerLargeTitle: true,}} />
      <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
      <Stack.Screen name="SubjectDetailScreen" component={SubjectDetailScreen} options={{ title: 'Subjects Details' }} />
      <Stack.Screen name="MaterialScreen" component={MaterialScreen} options={{ title: 'Material' }} />
    </Stack.Navigator>
  );
}

const RootNavigator = () => {


  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Courses') {
            return (<Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={iconName = focused ? '#0147ab' : 'gray'} class="bi bi-book-half" viewBox="0 0 16 16">
              <Path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
            </Svg>)
          } else if (route.name === 'Profile') {
            return (< Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={iconName = focused ? '#0147ab' : 'gray'} class="bi bi-person-circle" viewBox="0 0 16 16" >
              <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <Path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </ Svg >)
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-box';
          }
          else if (route.name == 'Search') {
            return (
              <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={iconName = focused ? '#0147ab' : 'gray'} class="bi bi-search" viewBox="0 0 16 16">
                <Path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </Svg>
            )
          }

          else if (route.name == 'Learns') {
            return (
              <Svg fill={iconName = focused ? '#0147ab' : 'gray'} width="20" height="20" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                  <Path d="M1750.176 0v1468.235h-225.882v338.824h169.412V1920H451.353c-82.447 0-161.506-36.141-215.718-99.388-42.917-50.824-66.635-116.33-66.635-182.965V282.353C169 126.494 295.494 0 451.353 0h1298.823Zm-338.823 1468.235H463.776c-89.223 0-166.023 60.989-179.576 140.047-1.13 9.036-2.259 18.07-2.259 25.977v3.388c0 40.659 13.553 79.059 40.659 109.553 31.624 38.4 79.059 59.859 128.753 59.859h960v-112.941H408.435v-112.942h1002.918v-112.94Zm-56.47-564.706h-790.59v112.942h790.588V903.529Zm56.47-564.705h-903.53v451.764h903.53V338.824ZM620.765 677.647h677.647V451.765H620.765v225.882Z" fill-rule="evenodd"/>
              </Svg>
            )
          }

          return <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={iconName = focused ? '#0147ab' : 'gray'} class="bi bi-book-half" viewBox="0 0 16 16">
            <Path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
          </Svg>;
        },
        tabBarActiveTintColor: '#0147ab',
        tabBarInactiveTintColor: 'gray',
        
        header: () => '',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          height: '55',
        }
      })}
    >
      <Tab.Screen name="Explore" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
    </Tab.Navigator>
  );
};

export default RootNavigator;