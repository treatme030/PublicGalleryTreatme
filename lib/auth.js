import auth from '@react-native-firebase/auth';

export const signIn = ({email, password}) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signUp = ({email, password}) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

// 로그인 상태가 변경될 때 현재 사용자의 정보를 파라미터로 받아오는 특정 콜백함수 등록
// onAuthStateChanged 함수는 사용자의 인증상태가 바뀔 때 등록된 콜백함수 호출
export const subscribeAuth = (callback) => {
  return auth().onAuthStateChanged(callback);
};

export const signOut = () => {
  return auth().signOut();
};
