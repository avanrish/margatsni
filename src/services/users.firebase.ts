import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  endAt,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';

import { auth, db } from '../lib/firebase';
import validateUsername from '../util/validateUsername';

export const doesUsernameExist = async (username: string) => {
  validateUsername(username);
  const userRef = collection(db, 'users');
  const q = query(userRef, where('username', '==', username));
  const { docs } = await getDocs(q);
  if (docs.length > 0) throw { code: 'auth/username-already-in-use' };
};

export const createUser = async ({ username, fullName, email, password }) => {
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

export const loginUser = async ({ email, password }) => {
  await signInWithEmailAndPassword(auth, email, password);
  await setPersistence(auth, browserLocalPersistence);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
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

export const toggleSave = async (userId, postId, saved, callback) => {
  const currentUserRef = doc(db, 'users', userId);

  updateDoc(currentUserRef, {
    saved: saved ? arrayRemove(postId) : arrayUnion(postId),
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
  return docs;
};

export const getUserDataByUserId = async (userId: string) => {
  const { docs } = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
  return docs[0].data();
};

export const updateUserPostsArray = async (action, userId, docId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    posts: action === 'add' ? arrayUnion(docId) : arrayRemove(docId),
  });
};
