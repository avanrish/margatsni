import { db } from '../lib/firebase-admin';

export const getPostDataById = async (postId: string) => {
  const response = await db.doc(`posts/${postId}`).get();
  return response.data();
};
