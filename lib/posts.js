import firestore from '@react-native-firebase/firestore';

const postsCollection = firestore().collection('posts');

export const PAGE_SIZE = 12;

export const createPost = ({user, photoURL, description}) => {
  return postsCollection.add({
    user,
    photoURL,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getPosts = async ({userId, mode, id} = {}) => {
  let query = postsCollection.orderBy('createdAt', 'desc').limit(PAGE_SIZE);

  if (userId) {
    query = query.where('user.id', '==', userId);
  }

  if (id) {
    const cursorDoc = await postsCollection.doc(id).get();
    query =
      mode === 'older'
        ? query.startAfter(cursorDoc)
        : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();

  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
};

// 특정 포스트 이전에 작성한 포스트 불러오기
export const getOlderPosts = async (id, userId) => {
  return getPosts({
    id,
    mode: 'older',
    userId,
  });
  // const cursorDoc = await postsCollection.doc(id).get();

  // let query = postsCollection
  //   .orderBy('createdAt', 'desc')
  //   .startAfter(cursorDoc)
  //   .limit(PAGE_SIZE);

  // if (userId) {
  //   query = query.where('user.id', '==', userId);
  // }

  // const snapshot = await query.get();

  // const posts = snapshot.docs.map((doc) => ({
  //   id: doc.id,
  //   ...doc.data(),
  // }));

  // return posts;
};

// 최근 작성한 포스트 불러오기
export const getNewerPosts = async (id, userId) => {
  return getPosts({
    id,
    mode: 'newer',
    userId,
  });

  // const cursorDoc = await postsCollection.doc(id).get();

  // let query = postsCollection
  //   .orderBy('createdAt', 'desc')
  //   .endBefore(cursorDoc)
  //   .limit(PAGE_SIZE);

  // if (userId) {
  //   query = query.where('user.id', '==', userId);
  // }

  // const snapshot = await query.get();

  // const posts = snapshot.docs.map((doc) => ({
  //   id: doc.id,
  //   ...doc.data(),
  // }));

  // return posts;
};

export const removePost = (id) => {
  return postsCollection.doc(id).delete();
};

export const updatePost = ({id, description}) => {
  return postsCollection.doc(id).update({
    description,
  });
};
