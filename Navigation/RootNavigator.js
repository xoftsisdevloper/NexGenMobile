  import * as React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import HomeScreen from '../Screens/HomeScreen';
  import CourseDetailScreen from '../Screens/CourseDetailScreen';
  import MaterialScreen from '../Screens/MaterialScreen';
  import Svg, { Path } from 'react-native-svg';
  import SubjectDetailScreen from '../Screens/SubjectDetailScreen';
  import SearchScreen from '../Screens/SearchScreen';
  import ProfileScreen from '../Screens/ProfileScreen';
  import LoginScreen from '../Screens/SessionsScreens/LoginScreen';
  import RegisterScreen from '../Screens/SessionsScreens/RegisterScreen';
import { useAuth } from './AuthContext';
import EditProfileScreen from '../Screens/EditProfileScreen';

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const HomeStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Explore" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
        <Stack.Screen name="SubjectDetailScreen" component={SubjectDetailScreen} options={{ title: 'Subjects Details' }} />
        <Stack.Screen name="MaterialScreen" component={MaterialScreen} options={{ title: 'Material' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="UserDetails" component={EditProfileScreen} options={{ title: 'Edit Your Profile' }} />
      </Stack.Navigator>
    );
  };

  const SearchStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Stack.Screen name="Explore" component={HomeScreen} options={{ headerShadowVisible: false, title: 'Explore', headerTitleAlign: 'center', headerLargeTitle: true }} />
        <Stack.Screen name="CourseDetailScreen" component={CourseDetailScreen} options={{ title: 'Course Details' }} />
        <Stack.Screen name="SubjectDetailScreen" component={SubjectDetailScreen} options={{ title: 'Subjects Details' }} />
        <Stack.Screen name="MaterialScreen" component={MaterialScreen} options={{ title: 'Material' }} />
      </Stack.Navigator>
    );
  };

  const ProfileStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="UserDetails" component={EditProfileScreen} options={{ title: 'Edit Your Profile' }} />
      </Stack.Navigator>
    );
  };

  const RootNavigator = () => {
    const { authUser, setAuthUser, userLoggedIn } = useAuth(); 
    
    console.log(authUser);
    
    return !userLoggedIn ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} initialParams={{setAuthUser}}/>
        <Stack.Screen name="Register" component={RegisterScreen} initialParams={{ setAuthUser }} />
      </Stack.Navigator>
    ) : (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let fillColor = focused ? '#0147ab' : 'gray';

            if (route.name === 'Home') {
              return (
                <Svg width="20" height="20" fill={fillColor} viewBox="0 0 16 16">
                  <Path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </Svg>
              );
            }

            if (route.name === 'Search') {
              return (
                <Svg width="20" height="20" fill={fillColor} viewBox="0 0 16 16">
                  <Path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </Svg>
              );
            }

            if (route.name === 'Profile') {
              return (
                <Svg width="20" height="20" fill={fillColor} viewBox="0 0 16 16">
                  <Path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <Path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </Svg>
              );
            }

            return null;
          },
          tabBarActiveTintColor: '#0147ab',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: {
            height: 60, // Fixed incorrect height
          },
        })}
        screenProps={{ authUser }} 
      >
        <Tab.Screen name="Home" component={HomeStack}  />
        <Tab.Screen name="Search" component={SearchStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    );
  };

  export default RootNavigator;
