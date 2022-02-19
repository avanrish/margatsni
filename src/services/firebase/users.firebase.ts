import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
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

import { auth, db } from '../../lib/firebase';
import toDataURL from '../../util/toDataURL';
import validateUsername from '../../util/validateUsername';
import { getImageRef, uploadImage, createNotification, deleteNotification, getChats } from '.';
import { Chat } from '../../types';

export const doesUsernameExist = async (username: string) => {
  validateUsername(username);
  const userRef = collection(db, 'users');
  const q = query(userRef, where('username', '==', username));
  const { docs } = await getDocs(q);
  if (docs.length > 0) throw { code: 'auth/username-already-in-use' };
};

export const createUser = async ({ username, fullName, email, password }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const imageRef = getImageRef('avatars', user.uid);
  const defaultImage = await toDataURL('/images/default.png');
  const imgUrl = await uploadImage(imageRef, defaultImage, true);
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    username,
    fullName,
    email,
    timestamp: serverTimestamp(),
    profileImg: imgUrl,
    following: [],
    followers: [],
    posts: [],
    saved: [],
  });
  await auth.signOut();
  await loginUser({ email, password });
};

export const loginUser = async ({ email, password }) => {
  await signInWithEmailAndPassword(auth, email, password);
  await setPersistence(auth, browserLocalPersistence);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const getSuggestions = async (following: string[], _limit: number) => {
  const { docs } = await getDocs(
    query(collection(db, 'users'), where('uid', 'not-in', following), limit(_limit))
  );
  return docs;
};

export const toggleFollow = async (
  currentUser,
  targetUserId: string,
  followed: boolean,
  callback
) => {
  const currentUserRef = doc(db, 'users', currentUser.uid);
  const targetUserRef = doc(db, 'users', targetUserId);

  updateDoc(currentUserRef, {
    following: followed ? arrayRemove(targetUserId) : arrayUnion(targetUserId),
  });
  updateDoc(targetUserRef, {
    followers: followed ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
  });
  if (callback) callback();
  if (followed) deleteNotification('follow', currentUser.username, null, targetUserId);
  else createNotification('follow', currentUser.username, currentUser.profileImg, targetUserId);
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
  return docs.map((user) => ({
    ...user.data(),
  }));
};

export const getUserDataByUserId = async (userId: string) => {
  const { docs } = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
  return docs[0]?.data();
};

export const updateUserPostsArray = async (action, userId, docId) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    posts: action === 'add' ? arrayUnion(docId) : arrayRemove(docId),
  });
};

export const updateUserImage = async (userId, profileImg) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    profileImg,
  });
};

export const updateUserData = async (userId, newUser) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, newUser);
};

export const changePassword = async (password) => await updatePassword(auth.currentUser, password);

export const reAuthenticate = async (email, password) => {
  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(auth.currentUser, credential);
};

export const changeEmail = async (email) => await updateEmail(auth.currentUser, email);

export const updateChatParticipants = async (oldUser, fullName) => {
  const chats = await getChats(oldUser);
  chats.forEach((chat: Chat) => {
    const chatRef = doc(db, 'chats', chat.chatId);
    const participants = chat.participants.map((p) => {
      if (p.uid === oldUser.uid) return { ...p, fullName };
      return { ...p };
    });
    updateDoc(chatRef, {
      participants,
    });
  });
};
