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
} from 'firebase/firestore';

import { auth, db } from '../../lib/firebase';
import toDataURL from '../../util/toDataURL';
import validateUsername from '../../util/validateUsername';
import { getImageRef, uploadImage, createNotification, deleteNotification, getChats } from '.';
import { Chat, LoginCredentials, NewUser, PostAction, SuggestedUser, User } from '../../types';

/**
 * Function used to update user's email address
 *
 * @param {string} email New email for current user
 * @returns {Promise<void>}
 */
export const changeEmail = async (email: string): Promise<void> =>
  await updateEmail(auth.currentUser, email);

/**
 * Function used to update user's password
 *
 * @returns {Promise<void>} A promise of type void
 */
export const changePassword = async (password: string): Promise<void> =>
  await updatePassword(auth.currentUser, password);

/**
 * Function used to create user
 *
 * @param {NewUser} userData User's data required to register an account
 * @returns {Promise<void>} A promise of type void
 */
export const createUser = async ({
  username,
  fullName,
  email,
  password,
}: NewUser): Promise<void> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const imageRef = getImageRef('avatars', user.uid);
  const defaultImage = await toDataURL('/images/default.png');
  const imgUrl = await uploadImage(imageRef, defaultImage as string, true);
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

/**
 * Function used to check if username is already taken and valid
 *
 * @param {string} username Username for new user
 * @returns {Promise<void>} A promise of type void
 */
export const doesUsernameExist = async (username: string): Promise<void> => {
  validateUsername(username);
  const userRef = collection(db, 'users');
  const q = query(userRef, where('username', '==', username));
  const { docs } = await getDocs(q);
  if (docs.length > 0) throw { code: 'auth/username-already-in-use' };
};

/**
 * Function used to get suggestions
 *
 * @param {string[]} following Array that contains IDs of users not followed by current user
 * @param {number} _limit Limit of suggestions to be fetched
 * @returns {Promise<SuggestedUser[]>} A promise of type array of users
 */
export const getSuggestions = async (
  following: string[],
  _limit: number
): Promise<SuggestedUser[]> => {
  const { docs } = await getDocs(
    query(collection(db, 'users'), where('uid', 'not-in', following), limit(_limit))
  );
  const users: SuggestedUser[] = docs.map((u) => ({
    fullName: u.data().fullName,
    profileImg: u.data().profileImg,
    uid: u.data().uid,
    username: u.data().username,
  }));
  return users;
};

/**
 * Function used to get User by ID
 *
 * @param {string} userId User's ID
 * @returns {Promise<User>} A promise of type User
 */
export const getUserDataByUserId = async (userId: string): Promise<User> => {
  const userRef = doc(db, 'users', userId);
  const user = await getDoc(userRef);
  return user?.data() as User;
};

/**
 * Function used to get users by a keyword
 *
 * @param {string} keyword Keyword used in search input
 * @returns {Promise<SuggestedUser[]>} A promise of type array of users - users' usernames start with keyword
 */
export const getUsersByKeyword = async (keyword: string): Promise<SuggestedUser[]> => {
  const { docs } = await getDocs(
    query(
      collection(db, 'users'),
      orderBy('username'),
      startAt(keyword),
      endAt(`${keyword}\uf8ff`),
      limit(8)
    )
  );
  const users: SuggestedUser[] = docs.map((user) => ({
    fullName: user.data().fullName,
    profileImg: user.data().profileImg,
    uid: user.data().uid,
    username: user.data().username,
  }));

  return users;
};

/**
 * Function used to log in
 *
 * @param {LoginCredentials} credentials User's credentials (email, password)
 * @returns {Promise<void>} A promise of type void
 */
export const loginUser = async ({ email, password }: LoginCredentials): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
  await setPersistence(auth, browserLocalPersistence);
};

/**
 * Function used to reauthenticate user
 *
 * @param {string} email Current user's email
 * @param {string} password Current user's password
 * @returns {Promise<void>} A promise of type void
 */
export const reAuthenticate = async (email: string, password: string): Promise<void> => {
  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(auth.currentUser, credential);
};

/**
 * Function used to reset user's password
 *
 * @param {string} email User's email address
 * @returns {Promise<void>} A promise of type void
 */
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Function used to follow or unfollow a user
 *
 * @param {User} currentUser Logged in user
 * @param {string} targetUserId ID of user to be followed or unfollowed
 * @param {boolean} followed True if user is followed, false otherwise
 * @param {() => void} callback Function executed after successfully followed/unfollowed
 * @returns {Promise<void>} A promise of type void
 */
export const toggleFollow = async (
  currentUser: User,
  targetUserId: string,
  followed: boolean,
  callback: () => void
): Promise<void> => {
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

/**
 * Function used to save posts or remove from saved
 *
 * @param {string} userId Current user's ID
 * @param {string} postId ID of a post
 * @param {boolean} saved True if post is already saved, false otherwise
 * @param {() => void} callback Function executed after successfully saved post or removed it from saved
 * @returns {Promise<void>} A promise of type void
 */
export const toggleSave = async (
  userId: string,
  postId: string,
  saved: boolean,
  callback: () => void
): Promise<void> => {
  const currentUserRef = doc(db, 'users', userId);

  updateDoc(currentUserRef, {
    saved: saved ? arrayRemove(postId) : arrayUnion(postId),
  });

  if (callback) callback();
};

/**
 * Function used to update chat participants
 *
 * @param {User} oldUser Current user's data before updating profile
 * @param {string} fullName New full name of currently logged in user
 * @returns {Promise<void>} A promise of type void
 */
export const updateChatParticipants = async (oldUser: User, fullName: string): Promise<void> => {
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

/**
 * Function used to update user's personal data
 *
 * @param {string} userId Current user's ID
 * @param {User} newUser Current user's object with new changed personal data
 * @returns {Promise<void>} A promise of type void
 */
export const updateUserData = async (userId: string, newUser: User): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, newUser);
};

/**
 * Function used to update current user's image URL
 *
 * @param {string} userId Current user's ID
 * @param {string} profileImg New image URL
 * @returns {Promise<void>} A promise of type void
 */
export const updateUserImage = async (userId: string, profileImg: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    profileImg,
  });
};

/**
 * Function used to update array of posts created by current user
 *
 * @param {PostAction} action Add or remove post to/from array
 * @param {string} userId Current user's ID
 * @param {string} docId ID of post that is added or removed
 * @returns {Promise<void>} A promise of type void
 */
export const updateUserPostsArray = async (
  action: PostAction,
  userId: string,
  docId: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    posts: action === 'add' ? arrayUnion(docId) : arrayRemove(docId),
  });
};
