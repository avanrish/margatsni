import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

import { db } from '../../lib/firebase';
import { Notification, NotificationType } from '../../types';

/**
 * Function used to create a notification
 *
 * @param {NotificationType} type Type of notification
 * @param {string} senderUsername Username of user sending notification
 * @param {string} senderProfileImg Profile Img Url of user sending notification
 * @param {string} targetUserId Id of user getting the notification
 * @param {string} postId Optional parameter containing post's Id
 * @returns {Promise<DocumentReference<DocumentData>>} Notification document
 */
export const createNotification = async (
  type: NotificationType,
  senderUsername: string,
  senderProfileImg: string,
  targetUserId: string,
  postId: string = null
): Promise<DocumentReference<DocumentData>> =>
  await addDoc(collection(db, 'notifications'), {
    type,
    senderUsername,
    senderProfileImg,
    targetUserId,
    postId,
    timestamp: serverTimestamp(),
  });

/**
 * A function used to delete notification by user who created it (e.g. if you follow and then unfollow)
 *
 * @param {NotificationType} type Type of notification
 * @param {string} senderUsername Username of user who sent notification
 * @param {string} postId Optional param - ID of post where notification was created
 * @param {string} targetUserId Optional param - ID of user who received notification
 * @returns {Promise<void>} A promise of type void
 */
export const deleteNotification = async (
  type: NotificationType,
  senderUsername: string,
  postId: string = null,
  targetUserId: string = null
): Promise<void> => {
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

/**
 * A function used to delete notification by its ID
 *
 * @param {string} docId ID of notification
 * @returns {Promise<void>} A promise of type void
 */
export const deleteNotificationById = async (docId: string): Promise<void> => {
  const docRef = doc(db, 'notifications', docId);
  await deleteDoc(docRef);
};

/**
 * Function used to get notifications in real time
 *
 * @param {string} userId Current user's ID
 * @param {Dispatch<SetStateAction<Notification[]>>} setDocs Function used to set notification state
 * @returns {Unsubscribe} A function returned by onSnapshot() that removes the listener when invoked.
 */
export const getNotifications = (
  userId: string,
  setDocs: Dispatch<SetStateAction<Notification[]>>
): Unsubscribe => {
  if (!userId) return;
  return onSnapshot(
    query(
      collection(db, 'notifications'),
      where('targetUserId', '==', userId),
      limit(3),
      orderBy('timestamp', 'desc')
    ),
    ({ docs }) => {
      const newDocs: Notification[] = docs.map((doc) => ({
        type: doc.data().type,
        senderUsername: doc.data().senderUsername,
        senderProfileImg: doc.data().senderProfileImg,
        targetUserId: doc.data().targetUserId,
        postId: doc.data().postId,
        timestamp: doc.data().timestamp,
        docId: doc.id,
      }));
      setDocs(newDocs);
    }
  );
};
