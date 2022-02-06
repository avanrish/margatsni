import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from '../lib/firebase';

export const createChat = async (participants) => {
  return await addDoc(collection(db, 'chats'), {
    participants,
    messages: [],
    lastUpdated: serverTimestamp(),
  });
};
