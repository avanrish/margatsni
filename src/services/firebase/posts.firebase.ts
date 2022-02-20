import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';

import { db } from '../../lib/firebase';
import { Comment, Post, User } from '../../types';

/**
 * Function used to add a coment to a post
 *
 * @param {string} id ID of post that user wants to comment
 * @param {string} commentToSend Comment written by user to be uploaded
 * @param {User} user Current user's object
 * @param {Dispatch<SetStateAction<Comment[]>>} setComments Function used to set `comments` state
 * @param {boolean} homePage True if user is on home page '/', false if user is on post page
 */
export const addComment = async (
  id: string,
  commentToSend: string,
  user: User,
  setComments: Dispatch<SetStateAction<Comment[]>>,
  homePage: boolean
) => {
  const docRef = doc(db, 'posts', id);
  const commentObj: Comment = {
    comment: commentToSend,
    username: user.username,
    profileImg: user.profileImg.match(/.*media/)[0],
  };

  await updateDoc(docRef, {
    comments: arrayUnion(commentObj),
  });
  setComments((prev) => (homePage ? [commentObj, ...prev] : [...prev, commentObj]));
};

/**
 * Function used to add image url to post document
 *
 * @param {string} docId ID of post
 * @param {string} downloadUrl Image url
 * @returns {Promise<void>} A promise of type void
 */
export const addImageLinkToPost = async (docId, downloadUrl) =>
  await updateDoc(doc(db, 'posts', docId), {
    image: downloadUrl,
  });

/**
 * Function used to create post
 *
 * @param {User} user Current user's object
 * @param {string} caption Optional param - Post caption
 * @returns {Promise<string>} A promise of type string
 */
export const createPost = async (user: User, caption: string = null): Promise<string> => {
  const docRef = await addDoc(collection(db, 'posts'), {
    username: user.username,
    caption,
    profileImg: user.profileImg.match(/.*media/)[0],
    likes: [],
    comments: [],
    timestamp: serverTimestamp(),
    uid: user.uid,
  });
  return docRef.id;
};

/**
 * Function used to delete a post
 *
 * @param {string} docId ID of post to be deleted
 * @returns {Promise<void>} A promise of type void
 */
export const deletePost = async (docId: string): Promise<void> =>
  deleteDoc(doc(db, 'posts', docId));

/**
 * Function used to get posts
 *
 * @param {number} _limit Limit how many posts we want to get (default - 15)
 * @returns {Promise<Post[]>} A promise of type array of Posts
 */
export const getPosts = async (_limit: number = 15): Promise<Post[]> => {
  const { docs } = await getDocs(
    query(collection(db, 'posts'), limit(_limit), orderBy('timestamp', 'desc'))
  );
  const posts: Post[] = docs.map((doc) => ({
    caption: doc.data().caption,
    comments: doc.data().comments,
    image: doc.data().image,
    likes: doc.data().likes,
    profileImg: doc.data().profileImg,
    timestamp: doc.data().timestamp,
    uid: doc.data().uid,
    username: doc.data().username,
    docId: doc.id,
  }));
  return posts;
};

/**
 * Function to get posts of specific user
 *
 * @param {string} id User's id
 * @returns {Promise<Post[]>} A promise of type array of Posts
 */
export const getPostsByUserId = async (id: string): Promise<Post[]> => {
  const { docs } = await getDocs(
    query(collection(db, 'posts'), where('uid', '==', id), orderBy('timestamp', 'desc'))
  );
  const posts: Post[] = docs.map((doc) => ({
    caption: doc.data().caption,
    comments: doc.data().comments,
    image: doc.data().image,
    likes: doc.data().likes,
    profileImg: doc.data().profileImg,
    timestamp: doc.data().timestamp,
    uid: doc.data().uid,
    username: doc.data().username,
    docId: doc.id,
  }));
  return posts;
};

/**
 * Function to get posts of specific user
 *
 * @param {string[]} following Array containing IDs of users that current user follows
 * @returns {Promise<Post[]>} A promise of type array of Posts
 */
export const getPostsOfFollowedUsers = async (following: string[]): Promise<Post[]> => {
  const { docs } = await getDocs(
    query(collection(db, 'posts'), where('uid', 'in', following), orderBy('timestamp', 'desc'))
  );
  const posts: Post[] = docs.map((doc) => ({
    caption: doc.data().caption,
    comments: doc.data().comments,
    image: doc.data().image,
    likes: doc.data().likes,
    profileImg: doc.data().profileImg,
    timestamp: doc.data().timestamp,
    uid: doc.data().uid,
    username: doc.data().username,
    docId: doc.id,
  }));
  return posts;
};

/**
 * Function used to get saved posts
 *
 * @param {string[]} savedPosts Array containing IDs of saved posts
 * @returns {Promise<Post[]>} A promise of type array of Posts
 */
export const getSavedPosts = async (savedPosts: string[]): Promise<Post[]> => {
  if (savedPosts?.length > 0) {
    const { docs } = await getDocs(
      query(collection(db, 'posts'), where(documentId(), 'in', savedPosts))
    );
    const posts: Post[] = docs.map((doc) => ({
      caption: doc.data().caption,
      comments: doc.data().comments,
      image: doc.data().image,
      likes: doc.data().likes,
      profileImg: doc.data().profileImg,
      timestamp: doc.data().timestamp,
      uid: doc.data().uid,
      username: doc.data().username,
      docId: doc.id,
    }));
    return posts;
  }
  return [];
};

/**
 * Function used to add or remove like
 *
 * @param {boolean} hasLiked True if liked, false otherwise
 * @param {string} currUserId Current user's ID
 * @param {string} postId ID of a post
 * @param {Dispatch<SetStateAction<string[]>>} setLikes Function used to set `likes` state
 * @returns {Promise<void>} A promise of type void
 */
export const toggleLike = async (
  hasLiked: boolean,
  currUserId: string,
  postId: string,
  setLikes: Dispatch<SetStateAction<string[]>>
): Promise<void> => {
  const docRef = doc(db, 'posts', postId);

  if (hasLiked) {
    setLikes((prevLikes) => prevLikes.filter((like) => like !== currUserId));
    updateDoc(docRef, {
      likes: arrayRemove(currUserId),
    });
  } else {
    setLikes((prevLikes) => [...prevLikes, currUserId]);
    updateDoc(docRef, {
      likes: arrayUnion(currUserId),
    });
  }
};
