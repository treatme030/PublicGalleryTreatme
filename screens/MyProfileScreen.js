import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

import Profile from '../components/Profile';
import {useUserContext} from '../contexts/UserContext';
import IconRightButton from '../components/IconRightButton';

const MyProfileScreen = () => {
  const {user} = useUserContext();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: user.displayName,
      headerRight: () => (
        <IconRightButton
          name="settings"
          onPress={() => navigation.push('Setting')}
        />
      ),
    });
  }, [navigation, user.displayName]);

  return <Profile userId={user.id} />;
};

export default MyProfileScreen;
