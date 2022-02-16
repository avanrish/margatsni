import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  updateMetadata,
  uploadString,
} from 'firebase/storage';

import { storage } from '../../lib/firebase';

export const getImageRef = (dir: string, name: string) => ref(storage, `${dir}/${name}/image`);

export const uploadImage = async (imageRef, selectedFile, isDefault = false) => {
  await uploadString(imageRef, selectedFile, 'data_url');
  updateMetadata(imageRef, {
    customMetadata: { isDefault: isDefault.toString() },
  });
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
};

export const getCustomMetadata = async (imageRef) => await getMetadata(imageRef);

export const deleteImage = async (dir: string, name: string) =>
  deleteObject(ref(storage, `${dir}/${name}/image`));
