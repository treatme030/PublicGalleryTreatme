import React, {Fragment, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from './SignInScreen';
import WelcomeScreen from './WelcomeScreen';
import {useUserContext} from '../contexts/UserContext';
import MainTab from './MainTab';
import {subscribeAuth} from '../lib/auth';
import {getUser} from '../lib/users';
import UploadScreen from './UploadScreen';
import ModifyScreen from './ModifyScreen';
import SettingScreen from './SettingScreen';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const {user, setUser} = useUserContext();

  useEffect(() => {
    const unsubscribe = subscribeAuth(async (currentUser) => {
      // 등록된 콜백함수는 사용자 정보가 바뀔때마다 호출됨
      // 처음 호출될 때 unsubscribe해서 한 번 호출된 후에는 더 이상 호출되지 않도록 설정
      unsubscribe();

      if (!currentUser) {
        return;
      }
      const profile = await getUser(currentUser.uid);
      if (!profile) {
        return;
      }
      setUser(profile);
    });
  }, [setUser]);

  return (
    <Stack.Navigator>
      {user ? (
        <Fragment>
          <Stack.Screen
            name="MainTab"
            component={MainTab}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Upload"
            component={UploadScreen}
            options={{title: '새 게시물', headerBackTitle: '뒤로가기'}}
          />
          <Stack.Screen
            name="Modify"
            component={ModifyScreen}
            options={{title: '설명 수정', headerBackTitle: '뒤로가기'}}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{title: '설정', headerBackTitle: '뒤로가기'}}
          />
        </Fragment>
      ) : (
        <Fragment>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{headerShown: false}}
          />
        </Fragment>
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
