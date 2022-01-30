import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';

import { storage } from '../lib/firebase';

export const getImageRef = (dir: string, name: string) => ref(storage, `${dir}/${name}/image`);

export const uploadImage = async (imageRef, selectedFile) => {
  await uploadString(imageRef, selectedFile, 'data_url');
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
};

export const deleteImage = async (dir: string, name: string) =>
  deleteObject(ref(storage, `${dir}/${name}/image`));
