import { CameraIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useRecoilValue } from 'recoil';

import { userState } from '../../../atoms/UserAtom';
import {
  createPost,
  getImageRef,
  uploadImage,
  updateUserPostsArray,
  addImageLinkToPost,
} from '../../../services/firebase';

export default function Create({ open, close, setSuccess }) {
  const { user } = useRecoilValue(userState);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const { t } = useTranslation();

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await createPost(user, captionRef.current.value);
    const imageRef = getImageRef('posts', docRef.id);
    const imageLink = await uploadImage(imageRef, selectedFile);
    await addImageLinkToPost(docRef.id, imageLink);
    await updateUserPostsArray('add', user.uid, docRef.id);

    close();

    setLoading(false);
    setSelectedFile(null);
    setSuccess(true);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      classNames={{
        modal: 'rounded-lg drop-shadow-md',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
    >
      {selectedFile ? (
        <div className="relative w-full h-[200px] cursor-pointer">
          <Image
            src={selectedFile}
            alt=""
            layout="fill"
            objectFit="contain"
            onClick={() => setSelectedFile(null)}
          />
        </div>
      ) : (
        <div
          onClick={() => filePickerRef.current.click()}
          className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
        >
          <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
      )}

      <div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t('common:uploadPhoto')}</h3>
          <div>
            <input type="file" ref={filePickerRef} onChange={addImageToPost} hidden />
          </div>
          <div>
            <input
              type="text"
              className="border-none focus:ring-0 w-full text-center"
              ref={captionRef}
              placeholder={t('common:captionMsg')}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          disabled={!selectedFile}
          type="button"
          className={`bg-blue-primary text-white w-full py-1 rounded-md font-semibold ${
            !selectedFile || loading ? 'opacity-70' : 'hover:brightness-110'
          }`}
          onClick={uploadPost}
        >
          {loading ? t('common:uploading') : t('common:uploadPost')}
        </button>
      </div>
    </Modal>
  );
}
