import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from '@firebase/auth';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from '@firebase/firestore';

import { auth, db } from '../lib/firebase';
import { ICredentials } from '../pages/accounts/signup';
import { ILogin } from '../pages/accounts/login';
import validateUsername from '../util/validateUsername';

export const createUser = async ({ username, fullName, email, password }: ICredentials) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    username,
    fullName,
    timestamp: serverTimestamp(),
    profileImg: '/images/default.png',
    following: [],
    followers: [],
    posts: [],
  });
  await setPersistence(auth, browserLocalPersistence);
};

export const loginUser = async ({ email, password }: ILogin) => {
  await signInWithEmailAndPassword(auth, email, password);
  await setPersistence(auth, browserLocalPersistence);
};

export const checkIfUsernameExists = async (username: string) => {
  validateUsername(username);
  const userRef = collection(db, 'users');
  const q = query(userRef, where('username', '==', username));
  const { docs } = await getDocs(q);
  if (docs.length > 0) throw { code: 'auth/username-already-in-use' };
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const getPosts = async (following) => {
  return await getDocs(
    query(
      collection(db, 'posts'),
      where('uid', 'in', following),
      orderBy('timestamp', 'desc'),
      limit(10)
    )
  );
};

export const getPostsByUserId = async (id: string) => {
  return await getDocs(
    query(collection(db, 'posts'), where('uid', '==', id), orderBy('timestamp', 'desc'), limit(9))
  );
};

export const getSuggestions = async (following: string[]) => {
  const { docs } = await getDocs(
    query(collection(db, 'users'), where('uid', 'not-in', following), limit(5))
  );
  return docs;
};

export const toggleFollow = async (
  currentUserId: string,
  targetUserId: string,
  followed: boolean,
  callback
) => {
  const currentUserRef = doc(db, 'users', currentUserId);
  const targetUserRef = doc(db, 'users', targetUserId);

  updateDoc(currentUserRef, {
    following: followed ? arrayRemove(targetUserId) : arrayUnion(targetUserId),
  });
  updateDoc(targetUserRef, {
    followers: followed ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
  });
  if (callback) callback();
};

export const getUsersByKeyword = async (keyword: string) => {
  const { docs } = await getDocs(
    query(
      collection(db, 'users'),
      orderBy('username'),
      startAt(keyword),
      endAt(`${keyword}\uf8ff`),
      limit(8)
    )
  );
  return { docs };
};

export const getPostById = async (id: string) => {
  const response = await getDoc(doc(db, 'posts', id));
  return response.data();
};

export const addComment = async (id, commentToSend, user, setComments, homePage) => {
  const docRef = doc(db, 'posts', id);
  const commentObj = {
    comment: commentToSend,
    username: user.username,
    profileImg: user.profileImg,
  };

  await updateDoc(docRef, {
    comments: arrayUnion(commentObj),
  });
  setComments((prev) => (homePage ? [commentObj, ...prev] : [...prev, commentObj]));
};

export const getUserDataByUsername = async (username: string) => {
  const { docs } = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
  return docs[0].data();
};
