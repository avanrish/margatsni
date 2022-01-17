import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../lib/firebase';

export const getPostsByUserId = async (id: string) => {
  return await getDocs(
    query(collection(db, 'posts'), where('uid', '==', id), orderBy('timestamp', 'desc'))
  );
};

export const getPostsOfFollowedUsers = async (following) => {
  return await getDocs(
    query(collection(db, 'posts'), where('uid', 'in', following), orderBy('timestamp', 'desc'))
  );
};

export const addComment = async (id, commentToSend, user, setComments, homePage) => {
  const docRef = doc(db, 'posts', id);
  const commentObj = {
    comment: commentToSend,
    username: user.username,
    profileImg: user.profileImg,
  };

  await updateDoc(docRef, {
    comments: arrayUnion(commentObj),
  });
  setComments((prev) => (homePage ? [commentObj, ...prev] : [...prev, commentObj]));
};

export const createPost = async (user, caption: string | null) => {
  return await addDoc(collection(db, 'posts'), {
    username: user?.username,
    caption,
    profileImg: user?.profileImg,
    likes: [],
    comments: [],
    timestamp: serverTimestamp(),
    uid: user.uid,
  });
};

export const addImageLinkToPost = async (docId, downloadUrl) =>
  await updateDoc(doc(db, 'posts', docId), {
    image: downloadUrl,
  });

export const deletePost = async (docId) => deleteDoc(doc(db, 'posts', docId));

export const toggleLike = async (hasLiked, currUserId, postId, setLikes) => {
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

export const getSavedPosts = async (savedPosts: string[]) => {
  if (savedPosts.length > 0) {
    const { docs } = await getDocs(
      query(collection(db, 'posts'), where(documentId(), 'in', savedPosts))
    );
    return docs;
  }
  return [];
};
