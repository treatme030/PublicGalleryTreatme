import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('users');

export const createUser = ({id, displayName, photoURL}) => {
  return usersCollection.doc(id).set({
    id,
    displayName,
    photoURL,
  });
};

export const getUser = async (id) => {
  const doc = await usersCollection.doc(id).get();
  return doc.data();
};
