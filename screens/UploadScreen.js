import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {useUserContext} from '../contexts/UserContext';
import {v4 as uuid} from 'uuid';
import {createPost} from '../lib/posts';
import events from '../lib/events';

import IconRightButton from '../components/IconRightButton';

const UploadScreen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const {res} = route.params ?? {};
  const {width} = useWindowDimensions();
  const animation = useRef(new Animated.Value(width)).current;
  const {user} = useUserContext();

  // 키보드가 열리고, 닫힐때마다 실행되어서 useCallback 사용
  const onSubmit = useCallback(async () => {
    navigation.pop();
    const asset = res.assets[0];

    const extension = asset.fileName.split('.').pop();
    const reference = storage().ref(`/photo/${user.id}/${uuid()}.${extension}`);

    if (Platform.OS === 'android') {
      await reference.putString(asset.base64, 'base64', {
        contentType: asset.type,
      });
    } else {
      await reference.putFile(asset.uri);
    }

    const photoURL = await reference.getDownloadURL();
    await createPost({description, photoURL, user});
    events.emit('refresh');
  }, [description, navigation, res, user]);

  // 키보드 감지 이벤트
  useEffect(() => {
    const didShow = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardOpen(true),
    );

    const didHide = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardOpen(false),
    );

    return () => {
      didShow.remove();
      didHide.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isKeyboardOpen ? 0 : width,
      useNativeDriver: false,
      duration: 150,
      delay: 100,
    }).start();
  }, [animation, isKeyboardOpen, width]);

  // 헤더에 컴포넌트 보여주기
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton name="send" onPress={onSubmit} />,
    });
  });

  return (
    <KeyboardAvoidingView style={styles.block}>
      <Animated.Image
        source={{uri: res.assets[0]?.uri}}
        style={[styles.image, {height: animation}]}
        resizeMode="cover"
      />
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="이 사진에 대한 설명을 입력하세요..."
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  image: {
    width: '100%',
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default UploadScreen;
