import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MyProfileScreen from './MyProfileScreen';
import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

const MyProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{title: '게시물'}}
      />
    </Stack.Navigator>
  );
};

export default MyProfileStack;
