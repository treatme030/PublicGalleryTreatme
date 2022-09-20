import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUserContext} from '../contexts/UserContext';
import {signOut} from '../lib/auth';
import {createUser} from '../lib/users';
import storage from '@react-native-firebase/storage';

import BorderedInput from './BorderedInput';
import CustomButton from './CustomButton';
import Avatar from './Avatar';

const SetupProfile = () => {
  const [displayName, setDisplayName] = useState('');
  const navigation = useNavigation();
  const {setUser} = useUserContext();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const {params} = useRoute();
  const {uid} = params ?? {};

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;

    if (response) {
      const asset = response.assets[0];
      const extension = asset.fileName.split('.').pop(); //확장자 추출
      const reference = storage().ref(`/profile/${uid}.${extension}`); // ref('/drectory/filename.extension')

      // OS에 따른 업로드 방식
      if (Platform.OS === 'android') {
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }

      photoURL = response ? await reference.getDownloadURL() : null;
    }

    const user = {
      id: uid,
      displayName,
      photoURL,
    };

    createUser(user);
    setUser(user);
  };

  const onCancel = () => {
    signOut();
    navigation.goBack();
  };

  const onSelectImage = () => {
    // 갤러리에서 이미지 선택
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      (res) => {
        if (res.didCancel) {
          return;
        }
        setResponse(res);
      },
    );
  };

  return (
    <View style={styles.block}>
      <Pressable onPress={onSelectImage}>
        <Avatar source={response && {uri: response.assets[0].uri}} size={128} />
        <Image
          style={styles.circle}
          source={
            response
              ? {uri: response?.assets[0]?.uri}
              : require('../assets/user.png')
          }
        />
      </Pressable>
      <View style={styles.form}>
        <BorderedInput
          placeholder="닉네임"
          value={displayName}
          onChangeText={setDisplayName}
          onSubmitEditing={onSubmit}
          returnKeyType="next"
        />
        {loading ? (
          <ActivityIndicator size={32} color="#6200ee" style={styles.spinner} />
        ) : (
          <View style={styles.buttons}>
            <CustomButton title="다음" hasMarginBottom onPress={onSubmit} />
            <CustomButton title="취소" onPress={onCancel} theme="secondary" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    marginTop: 16,
  },
  buttons: {
    marginTop: 48,
  },
  spinner: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SetupProfile;
