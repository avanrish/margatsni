import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '../lib/firebase';

export const createNotification = async (
  type,
  senderUsername,
  senderProfileImg,
  targetUserId,
  postId = null
) =>
  await addDoc(collection(db, 'notifications'), {
    type,
    senderUsername,
    senderProfileImg,
    targetUserId,
    postId,
    timestamp: serverTimestamp(),
  });

export const getNotifications = (userId, setDocs) => {
  if (!userId) return;
  return onSnapshot(
    query(
      collection(db, 'notifications'),
      where('targetUserId', '==', userId),
      limit(3),
      orderBy('timestamp', 'desc')
    ),
    ({ docs }) => {
      const newDocs = docs.map((doc) => ({ ...doc.data(), docId: doc.id }));
      setDocs(newDocs);
    }
  );
};

export const deleteNotification = async (
  type,
  senderUsername,
  postId = null,
  targetUserId = null
) => {
  let notification;
  if (postId) {
    const { docs } = await getDocs(
      query(
        collection(db, 'notifications'),
        where('senderUsername', '==', senderUsername),
        where('type', '==', type),
        where('postId', '==', postId)
      )
    );
    notification = docs;
  } else {
    const { docs } = await getDocs(
      query(
        collection(db, 'notifications'),
        where('senderUsername', '==', senderUsername),
        where('type', '==', type),
        where('targetUserId', '==', targetUserId)
      )
    );
    notification = docs;
  }
  if (notification[0]) deleteNotificationById(notification[0].id);
};

export const deleteNotificationById = async (docId) => {
  const docRef = doc(db, 'notifications', docId);
  await deleteDoc(docRef);
};
