import { db } from '../../lib/firebase-admin';

export const getUserDataByUsername = async (username: string) => {
  const query = db.collection('users').where('username', '==', username);
  const { docs } = await query.get();
  return docs[0]?.data();
};
