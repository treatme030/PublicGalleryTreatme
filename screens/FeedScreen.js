import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import PostCard from '../components/PostCard';
import usePosts from '../hooks/usePosts';

const FeedScreen = () => {
  const {posts, noMorePost, refreshing, onLoadMore, onRefresh} = usePosts();

  // useEffect(() => {
  //   events.addListener('refresh', onRefresh);
  //   events.addListener('removePost', removePost);
  //   return () => {
  //     events.removeListener('refresh', onRefresh);
  //     events.removeListener('removePost', removePost);
  //   };
  // }, [onRefresh, removePost]);

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.75}
      ListFooterComponent={
        !noMorePost && (
          <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
        )
      }
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    />
  );
};

/**
 한 번만 만들고 재사용하는 것이 성능면에서 좋기때문에
 FlatList 컴포넌트 밖에 renderItem을 만들어주거나
 컴포넌트 밖에 선언하지 않고 useMemo를 사용
 */
const renderItem = ({item}) => (
  <PostCard
    createdAt={item.createdAt}
    description={item.description}
    id={item.id}
    user={item.user}
    photoURL={item.photoURL}
  />
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
});

export default FeedScreen;
