import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import Profile from '../components/Profile';

const ProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {userId, displayName} = route.params ?? {};

  useEffect(() => {
    navigation.setOptions({
      title: displayName,
    });
  });
  return <Profile userId={userId} />;
};

export default ProfileScreen;
