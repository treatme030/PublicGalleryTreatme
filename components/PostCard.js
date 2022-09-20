import React, {Fragment, useMemo} from 'react';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Avatar from './Avatar';
import {useUserContext} from '../contexts/UserContext';
import usePostActions from '../hooks/usePostActions';
import ActionSheetModal from './ActionSheetModal';

const PostCard = ({user, photoURL, description, createdAt, id}) => {
  // 내비게이션 상태 조회
  const routeNames = useNavigationState((state) => state.routeNames);
  const date = useMemo(
    () => (createdAt ? new Date(createdAt._seconds * 1000) : new Date()),
    [createdAt],
  );
  const navigation = useNavigation();
  // 자신의 포스트 확인
  const {user: me} = useUserContext();
  const isMyPost = me.id === user.id;

  const {isSelecting, onPressMore, onClose, actions} = usePostActions({
    id,
    description,
  });

  const onOpenProfile = () => {
    if (routeNames.find((routeName) => routeName === 'MyProfile')) {
      navigation.navigate('MyProfile');
    }
    navigation.navigate('Profile', {
      userId: user.id,
      displayName: user.displayName,
    });
  };

  return (
    <Fragment>
      <View style={styles.block}>
        <View style={[styles.head, styles.paddingBlock]}>
          <Pressable style={styles.profile} onPress={onOpenProfile}>
            <Avatar source={user.photoURL && {uri: user.photoURL}} />
            <Text style={styles.displayName}>{user.displayName}</Text>
          </Pressable>
          {isMyPost && (
            <Pressable hitSlop={8} onPress={onPressMore}>
              <Icon name="more-vert" size={20} />
            </Pressable>
          )}
        </View>
        <Image
          source={{uri: photoURL}}
          style={styles.image}
          resizeMode="cover"
          resizeMethod="resize"
        />
        <View style={styles.paddingBlock}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.date}>{date.toLocaleString()}</Text>
        </View>
      </View>
      <ActionSheetModal
        visible={isSelecting}
        onClose={onClose}
        actions={actions}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  block: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  displayName: {
    fontSize: 16,
    lineHeight: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: '100%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  date: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
});

export default PostCard;
