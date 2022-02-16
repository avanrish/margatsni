import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../../lib/firebase';
import { createNotification } from './notifications.firebase';

export const createChat = async (participants) => {
  return await addDoc(collection(db, 'chats'), {
    participants,
    messages: [],
    lastUpdated: serverTimestamp(),
  });
};

export const getChatsSubscribe = (user, setChats, selectedChat, setSelectedChat) => {
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
      const newDocs = docs.map((doc) => ({ ...doc.data(), chatId: doc.id }));
      if (newDocs.findIndex((doc) => doc.chatId === selectedChat) === -1) setSelectedChat(null);
      setChats(newDocs);
    }
  );
};

export const getChats = async ({ username, fullName, profileImg, uid }) => {
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
  return docs.map((doc) => ({ ...doc.data(), chatId: doc.id }));
};

export const sendMessage = async (chatId, message, userId) => {
  const docRef = doc(db, 'chats', chatId);
  const messageObj = {
    message,
    uid: userId,
    timestamp: Timestamp.fromDate(new Date()),
  };

  await updateDoc(docRef, {
    messages: arrayUnion(messageObj),
    lastUpdated: serverTimestamp(),
  });
};

export const deleteUserFromChat = async (chatId, participants, userId, fullName) => {
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
