import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { loginBeforeScreenstyles } from '../../assets/styles/Styles';
import { useNavigation } from '@react-navigation/native';

const RoleTypeLogin = () => {
  const [slideAnimTeacher] = useState(new Animated.Value(-400));
  const [slideAnimStudent] = useState(new Animated.Value(400));
  const navigation = useNavigation();

  // Animation for Teacher and Student buttons
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnimTeacher, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimStudent, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Navigation function
  const SwitchScreen = (screen, role) => {
    navigation.navigate(screen, {role: role});
  };

  return (
    <View style={loginBeforeScreenstyles.container}>
      {/* <View style={loginBeforeScreenstyles.LogoBox}>
        <Image source={require('../../assets/images/NexGenImage.png')} style={loginBeforeScreenstyles.logo} />
      </View> */}


      {/* Teacher Button Sliding in from the Left */}
      <Animated.View style={[loginBeforeScreenstyles.outerBox, { transform: [{ translateX: slideAnimTeacher }] }]}>
        <TouchableOpacity style={loginBeforeScreenstyles.loginTypeBlocks} onPress={() => SwitchScreen('Login', 'Teacher')}>
          <View style={loginBeforeScreenstyles.innerBox}>
            <Image source={require('../../assets/images/teacher.png')} style={loginBeforeScreenstyles.teacherImg} />
            <Text style={loginBeforeScreenstyles.titleText}>Teacher</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Student Button Sliding in from the Right */}
      <Animated.View style={[loginBeforeScreenstyles.outerBox, { transform: [{ translateX: slideAnimStudent }] }]}>
        <TouchableOpacity style={loginBeforeScreenstyles.loginTypeBlocks} onPress={() => SwitchScreen('Login', 'Student')}>
          <View style={loginBeforeScreenstyles.innerBox}>
            <Image source={require('../../assets/images/student.png')} style={loginBeforeScreenstyles.teacherImg} />
            <Text style={loginBeforeScreenstyles.titleText}>Student</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default RoleTypeLogin;
