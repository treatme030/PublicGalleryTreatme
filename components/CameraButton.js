import {useNavigation} from '@react-navigation/native';
import React, {Fragment, useState} from 'react';
import {
  ActionSheetIOS,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheetModal from './ActionSheetModal';

const TABBAR_HEIGHT = 49;

const imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};

const CameraButton = () => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const bottom = Platform.select({
    android: TABBAR_HEIGHT / 2,
    ios: TABBAR_HEIGHT / 2 + insets.bottom - 4,
  });

  const onPickImage = (res) => {
    if (res.didCancel || !res) {
      return;
    }
    navigation.push('Upload', {res});
  };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPress = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          console.log('카메라 촬영');
        } else if (buttonIndex === 1) {
          console.log('사진 선택');
        }
      },
    );
  };

  return (
    <Fragment>
      <View style={[styles.wrapper, {bottom}]}>
        <Pressable
          android_ripple={{
            color: '#fff',
          }}
          style={styles.circle}
          onPress={onPress}>
          <Icon name="camera-alt" size={24} color="#fff" />
        </Pressable>
      </View>
      <ActionSheetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        actions={[
          {
            icon: 'camera-alt',
            text: '카메라로 촬영하기',
            onPress: onLaunchCamera,
          },
          {
            icon: 'photo',
            text: '사진 선택하기',
            onPress: onLaunchImageLibrary,
          },
        ]}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    width: 54,
    height: 54,
    borderRadius: 27,
    position: 'absolute',
    left: '50%',
    transform: [{translateX: -27}],
    ...Platform.select({
      android: {
        elevation: 5,
        overflow: 'hidden',
      },
      ios: {
        shadowColor: '#4d4d4d',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  circle: {
    backgroundColor: '#6200ee',
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
  },
});

export default CameraButton;
