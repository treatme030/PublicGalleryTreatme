import {useCallback, useEffect, useState} from 'react';
import {useUserContext} from '../contexts/UserContext';
import {getNewerPosts, getOlderPosts, getPosts, PAGE_SIZE} from '../lib/posts';
import usePostEventEffect from './usePostsEventEffect';

export default function usePosts(userId) {
  const [posts, setPosts] = useState(null);
  // 마지막 포스트 조회한 상태
  const [noMorePost, setNoMorePost] = useState(false);
  // 새로운 포스트 불러오기 위한 상태
  const [refreshing, setRefreshing] = useState(false);

  const {user} = useUserContext();

  // 스크롤이 맨 아래까지 내렸을 때 호출되어 결과물을 posts 상태에 추가
  const onLoadMore = async () => {
    if (noMorePost || !posts || posts.length < PAGE_SIZE) {
      return;
    }
    const lastPost = posts[posts.length - 1];
    const olderPosts = await getOlderPosts(lastPost.id, userId);

    // 더이상 불러올 포스트가 없을 때
    if (olderPosts.length < PAGE_SIZE) {
      setNoMorePost(true);
    }
    setPosts(posts.concat(olderPosts));
  };

  // 최근 작성한 포스트 불러오기
  // 화면을 맨 위에서 아래로 끌어당겼을 때 호출
  const onRefresh = useCallback(async () => {
    if (!posts || posts.length === 0 || refreshing) {
      return;
    }
    const firstPost = posts[0];
    setRefreshing(true);

    const newerPosts = await getNewerPosts(firstPost.id, userId);
    setRefreshing(false);

    if (newerPosts.length === 0) {
      return;
    }
    setPosts(newerPosts.concat(posts));
  }, [posts, refreshing, userId]);

  useEffect(() => {
    getPosts({userId}).then((_posts) => {
      setPosts(_posts);
      if (_posts.length < PAGE_SIZE) {
        setNoMorePost(true);
      }
    });
  }, [userId]);

  const removePost = useCallback(
    (postId) => {
      setPosts(posts.filter((post) => post.id !== postId));
    },
    [posts],
  );

  const updatePost = useCallback(
    ({postId, description}) => {
      const nextPosts = posts.map((post) =>
        post.id === postId ? {...post, description} : post,
      );
      setPosts(nextPosts);
    },
    [posts],
  );

  usePostEventEffect({
    refresh: onRefresh,
    removePost,
    enabled: !userId || userId === user.id,
    updatePost,
  });

  return {
    posts,
    noMorePost,
    refreshing,
    onLoadMore,
    onRefresh,
    removePost,
  };
}
