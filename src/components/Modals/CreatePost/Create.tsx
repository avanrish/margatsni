import { CameraIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../../atoms/UserAtom';
import {
  createPost,
  getImageRef,
  uploadImage,
  updateUserPostsArray,
  addImageLinkToPost,
} from '../../../services/firebase';
import CustomModal from '../../CustomModal';

export default function Create({ open, close, setSuccess }) {
  const { user } = useRecoilValue(userState);
  const [selectedFile, setSelectedFile] = useState<string>(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (selectedFile === null && filePickerRef.current) filePickerRef.current.value = null;
  }, [selectedFile]);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result as string);
    };
  };

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);
    const docId = await createPost(user, captionRef.current.value);
    const imageRef = getImageRef('posts', docId);
    const imageLink = await uploadImage(imageRef, selectedFile);
    await addImageLinkToPost(docId, imageLink);
    await updateUserPostsArray('add', user.uid, docId);

    close();

    setLoading(false);
    setSelectedFile(null);
    setSuccess(true);
  };

  return (
    <CustomModal medium open={open} onClose={() => (close(), setSelectedFile(null))}>
      <div className="text-base font-semibold py-4">{t`createPost`}</div>
      <div className="h-80 flex flex-col items-center justify-center space-y-2">
        {selectedFile ? (
          <div className="relative w-full h-full cursor-pointer">
            <Image
              src={selectedFile}
              alt=""
              layout="fill"
              objectFit="contain"
              onClick={() => setSelectedFile(null)}
            />
          </div>
        ) : (
          <>
            <div
              onClick={() => filePickerRef.current.click()}
              className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 cursor-pointer"
            >
              <CameraIcon className="h-7 w-7 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl leading-6 font-thin">{t('uploadPhoto')}</h3>
          </>
        )}
      </div>
      <div className="px-4 py-2 space-y-2">
        <input
          type="text"
          className="border-none focus:ring-0 w-full text-center p-0"
          ref={captionRef}
          placeholder={t('captionMsg')}
        />
        <button
          disabled={!selectedFile || loading}
          type="button"
          className={`bg-blue-primary text-white w-40 py-1 rounded-md font-semibold ${
            !selectedFile || loading ? 'opacity-70' : 'hover:brightness-110'
          }`}
          onClick={uploadPost}
        >
          {loading ? t('uploading') : t('uploadPost')}
        </button>
      </div>
      <div>
        <input type="file" ref={filePickerRef} onChange={addImageToPost} hidden />
      </div>
    </CustomModal>
  );
}
