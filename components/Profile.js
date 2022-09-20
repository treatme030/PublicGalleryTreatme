import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import usePosts from '../hooks/usePosts';
import {getUser} from '../lib/users';

import Avatar from './Avatar';
import PostGridItem from './PostGridItem';

const Profile = ({userId}) => {
  const [user, setUser] = useState(null);
  const {posts, noMorePost, refreshing, onRefresh, onLoadMore} =
    usePosts(userId);

  useEffect(() => {
    getUser(userId).then(setUser);
  }, [userId]);

  // 자신의 프로필을 보고 있을 때만 새 포스트 작성 후 새로고침
  // useEffect(() => {
  //   if (!isMyProfile) {
  //     return;
  //   }
  //   events.addListener('refresh', onRefresh);
  //   events.addListener('removePost', removePost);
  //   return () => {
  //     events.removeListener('refresh', onRefresh);
  //     events.removeListener('removePost', removePost);
  //   };
  // }, [isMyProfile, onRefresh, removePost]);

  if (!user || !posts) {
    return (
      <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
    );
  }

  return (
    <FlatList
      style={styles.block}
      data={posts}
      renderItem={renderItem}
      numColumns={3}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.userInfo}>
          <Avatar source={user.photoURL && {uri: user.photoURL}} size={128} />
          <Text style={styles.username}>{user.displayName}</Text>
        </View>
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.25}
      ListFooterComponent={
        !noMorePost && (
          <ActivityIndicator
            style={styles.bottomSpinner}
            size={32}
            color="#6200ee"
          />
        )
      }
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    />
  );
};

const renderItem = ({item}) => <PostGridItem post={item} />;

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  block: {
    flex: 1,
  },
  userInfo: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 64,
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: '#424242',
  },
});
export default Profile;
