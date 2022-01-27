import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';

import { storage } from '../lib/firebase';

export const getImageRef = (name: string, dir: string) => ref(storage, `${dir}/${name}/image`);

export const uploadImage = async (imageRef, selectedFile) => {
  await uploadString(imageRef, selectedFile, 'data_url');
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
};

export const deleteImage = async (docId) => deleteObject(ref(storage, `posts/${docId}/image`));
