import { db } from '../../lib/firebase-admin';
import { User } from '../../types';

/**
 * Function used to get user by username
 *
 * @param {string} username Username of a user
 * @returns {Promise<User>} A promise of type User
 */
export const getUserDataByUsername = async (username: string): Promise<User> => {
  const query = db.collection('users').where('username', '==', username);
  const { docs } = await query.get();
  const [user] = docs;
  if (!user) return null;
  return {
    profileImg: user.data().profileImg,
    uid: user.data().uid,
    username: user.data().username,
    fullName: user.data().fullName,
    email: user.data().email,
    followers: user.data().followers,
    following: user.data().following,
    posts: user.data().posts,
    saved: user.data().saved,
    bio: user.data().bio || null,
    website: user.data().website || null,
    timestamp: user.data().timestamp,
  };
};
