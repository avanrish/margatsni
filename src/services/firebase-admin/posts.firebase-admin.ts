import { db } from '../../lib/firebase-admin';
import { Post } from '../../types';

/**
 * Function used to get post by its ID
 *
 * @param {string} postId Post's ID
 * @returns {Promise<Post>} A promise of type Post
 */
export const getPostDataById = async (postId: string): Promise<Post> => {
  const response = await db.doc(`posts/${postId}`).get();
  return {
    caption: response.data().caption,
    comments: response.data().comments,
    image: response.data().image,
    likes: response.data().likes,
    profileImg: response.data().profileImg,
    timestamp: response.data().timestamp,
    uid: response.data().uid,
    username: response.data().username,
    docId: response.id,
  };
};
