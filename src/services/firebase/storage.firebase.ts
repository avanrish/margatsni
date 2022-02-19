import {
  deleteObject,
  FullMetadata,
  getDownloadURL,
  getMetadata,
  ref,
  StorageReference,
  updateMetadata,
  uploadString,
} from 'firebase/storage';

import { storage } from '../../lib/firebase';
import { StorageDirectory } from '../../types';

/**
 * Function used to get image reference from storage
 *
 * @param {StorageDirectory} dir Information whether image is an avatar or belongs to a post
 * @param {string} name Name of directory of the image
 * @returns {StorageReference} Represents a reference to a Google Cloud Storage object
 */
export const getImageRef = (dir: StorageDirectory, name: string): StorageReference =>
  ref(storage, `${dir}/${name}/image`);

/**
 * Function used to upload an image
 *
 * @param {StorageReference} imageRef Represents a reference to a Google Cloud Storage object
 * @param {string} selectedFile Selected file as data URL
 * @param {boolean} isDefault True if image is default image, false otherwise
 * @returns {Promise<string>} A promise of type string
 */
export const uploadImage = async (
  imageRef: StorageReference,
  selectedFile: string,
  isDefault: boolean = false
): Promise<string> => {
  await uploadString(imageRef, selectedFile, 'data_url');
  updateMetadata(imageRef, {
    customMetadata: { isDefault: isDefault.toString() },
  });
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
};

/**
 * Function used to get image's custom metadata
 *
 * @param {StorageReference} imageRef Represents a reference to a Google Cloud Storage object
 * @returns {Promise<FullMetadata>} A promise of type FullMetadata
 */
export const getCustomMetadata = async (imageRef: StorageReference): Promise<FullMetadata> =>
  await getMetadata(imageRef);

/**
 * Function used to delete an image
 *
 * @param {StorageDirectory} dir Information whether image is an avatar or belongs to a post
 * @param {string} name Name of directory of the image
 * @returns {Promise<void>} A promise of type void
 */
export const deleteImage = async (dir: StorageDirectory, name: string): Promise<void> =>
  deleteObject(ref(storage, `${dir}/${name}/image`));
