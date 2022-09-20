import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import IconRightButton from '../components/IconRightButton';
import events from '../lib/events';
import {updatePost} from '../lib/posts';

const ModifyScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const [description, setDescription] = useState(params.description);

  const onSubmit = useCallback(async () => {
    await updatePost({
      id: params.id,
      description,
    });

    events.emit('updatePost', {
      postId: params.id,
      description,
    });

    navigation.pop();
  }, [description, navigation, params.id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton name="check" onPress={onSubmit} />,
    });
  }, [navigation, onSubmit]);

  return (
    <KeyboardAvoidingView
      style={styles.block}
      behavior={Platform.select({ios: 'height'})}
      keyboardVerticalOffset={Platform.select({
        ios: 88,
      })}>
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
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default ModifyScreen;
