import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../lib/firebase';

export const createChat = async (participants) => {
  return await addDoc(collection(db, 'chats'), {
    participants,
    messages: [],
    lastUpdated: serverTimestamp(),
  });
};

export const getChats = (user, setChats, selectedChat, setSelectedChat) => {
  if (!user) return;
  const { username, fullName, profileImg, uid } = user;
  return onSnapshot(
    query(
      collection(db, 'chats'),
      where('participants', 'array-contains', {
        username,
        fullName,
        profileImg,
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

export const sendMessage = async (chatId, message, userId) => {
  const docRef = doc(db, 'chats', chatId);
  const messageObj = {
    message,
    uid: userId,
  };

  await updateDoc(docRef, {
    message: arrayUnion(messageObj),
  });
};
