import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

import { db } from '../../lib/firebase';
import { Chat, Message, Participant, User } from '../../types';
import { createNotification } from './notifications.firebase';

/**
 * Function used to create chat with participants.
 *
 * @param {Participant[]} participants Array with all participants including user creating chat.
 *
 * @return {Promise<DocumentReference<DocumentData>>} A promise returning document data.
 */
export const createChat = async (
  participants: Participant[]
): Promise<DocumentReference<DocumentData>> =>
  await addDoc(collection(db, 'chats'), {
    participants,
    messages: [],
    lastUpdated: serverTimestamp(),
  });

/**
 * Function used to leave a chat.
 *
 * @param {string} chatId Chat's ID in firestore.
 * @param {Participant[]} participants Array with all participants including user creating chat.
 * @param {string} userId Current user's UID.
 * @param {string} fullName Current user's fullName.
 *
 * @return {Promise<void>} A promise of type void.
 */
export const deleteUserFromChat = async (
  chatId: string,
  participants: Participant[],
  userId: string,
  fullName: string
): Promise<void> => {
  const docRef = doc(db, 'chats', chatId);
  const newParticipants = participants.map((p) => {
    if (p.uid === userId) return { ...p, left: true };
    return { ...p };
  });

  await updateDoc(docRef, {
    participants: newParticipants,
  });

  sendMessage(chatId, fullName, 'SYSTEM');

  const { profileImg, username } = participants.filter((p) => p.uid === userId)[0];
  participants.forEach((p) => {
    if (p.uid !== userId) createNotification('leftChat', username, profileImg, p.uid);
  });
};

/**
 * Function used to get chats for specific user
 *
 * @param {Participant} participant Object of type Participant.
 * @returns {Promise<Chat[]>} Promise of type array of Chat objects
 */
export const getChats = async ({
  username,
  fullName,
  profileImg,
  uid,
}: Participant): Promise<Chat[]> => {
  const { docs } = await getDocs(
    query(
      collection(db, 'chats'),
      where('participants', 'array-contains', {
        username,
        fullName,
        profileImg: profileImg.match(/.*media/)[0],
        uid,
      })
    )
  );
  return docs.map((doc) => ({
    lastUpdated: doc.data().lastUpdated,
    messages: doc.data().messages,
    participants: doc.data().participants,
    chatId: doc.id,
  }));
};

/**
 * Function used to get chats and its updates in real time
 *
 * @param {User} user Current user's object
 * @param {Dispatch<SetStateAction<TChat[]>>} setChats Function to set `chats` state
 * @param {string} selectedChat Selected chat's ID
 * @param {Dispatch<SetStateAction<string>>} setSelectedChat Function to set selected chat
 * @returns {Unsubscribe} A function returned by onSnapshot() that removes the listener when invoked.
 */
export const getChatsSubscribe = (
  user: User,
  setChats: Dispatch<SetStateAction<Chat[]>>,
  selectedChat: string,
  setSelectedChat: Dispatch<SetStateAction<string>>
): Unsubscribe => {
  if (!user) return;
  const { username, fullName, profileImg, uid } = user;
  return onSnapshot(
    query(
      collection(db, 'chats'),
      where('participants', 'array-contains', {
        username,
        fullName,
        profileImg: profileImg.match(/.*media/)[0],
        uid,
      }),
      orderBy('lastUpdated', 'desc')
    ),
    ({ docs }) => {
      const newDocs = docs.map((doc) => ({
        lastUpdated: doc.data().lastUpdated,
        messages: doc.data().messages,
        participants: doc.data().participants,
        chatId: doc.id,
      }));
      if (newDocs.findIndex((doc) => doc.chatId === selectedChat) === -1) setSelectedChat(null);
      setChats(newDocs);
    }
  );
};

/**
 * Function used to send a message
 *
 * @param {string} chatId Current chat's ID
 * @param {string} message A message written by user
 * @param {string} userId Current user's ID
 * @returns {Promise<void>} A promise of type void
 */
export const sendMessage = async (
  chatId: string,
  message: string,
  userId: string
): Promise<void> => {
  const docRef = doc(db, 'chats', chatId);
  const messageObj: Message = {
    message,
    uid: userId,
    timestamp: Timestamp.fromDate(new Date()),
  };

  await updateDoc(docRef, {
    messages: arrayUnion(messageObj),
    lastUpdated: serverTimestamp(),
  });
};
