import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';

import { storage } from '../lib/firebase';
import { addImageLinkToPost } from './firebase';

export const getImageRef = (docId: string) => ref(storage, `posts/${docId}/image`);

export const uploadImage = async (imageRef, selectedFile, docId) => {
  await uploadString(imageRef, selectedFile, 'data_url');
  const downloadUrl = await getDownloadURL(imageRef);
  await addImageLinkToPost(docId, downloadUrl);
};

export const deleteImage = async (docId) => deleteObject(ref(storage, `posts/${docId}/image`));
