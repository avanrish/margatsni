import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Image from 'next/image';
import { CameraIcon } from '@heroicons/react/outline';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from '@firebase/firestore';
import { ref, getDownloadURL, uploadString } from '@firebase/storage';
import 'react-responsive-modal/styles.css';
import { Modal as RModal } from 'react-responsive-modal';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';

import { db, storage } from '../../lib/firebase';
import { userState } from '../../atoms/UserAtom';

export default function Modal({ open, setOpen }: ModalProps) {
  const { user } = useRecoilValue(userState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
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
    const docRef = await addDoc(collection(db, 'posts'), {
      username: user?.username,
      caption: captionRef.current.value,
      profileImg: user?.profileImg,
      likes: [],
      comments: [],
      timestamp: serverTimestamp(),
      uid: user.uid,
    });
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    await uploadString(imageRef, selectedFile, 'data_url').then(async () => {
      const downloadUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(db, 'posts', docRef.id), {
        image: downloadUrl,
      });
    });
    const userRef = doc(db, 'users', user.uid);
    updateDoc(userRef, {
      posts: arrayUnion(docRef.id),
    });
    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
    setSuccess(true);
  };

  return (
    <>
      <RModal
        open={open}
        onClose={() => setOpen(false)}
        classNames={{
          modal: 'rounded-lg drop-shadow-md',
          modalContainer: 'overflow-y-hidden flex items-center justify-center',
        }}
      >
        <div>
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('common:uploadPhoto')}
              </h3>
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
              className="bg-blue-primary text-white w-full py-1 rounded-md hover:brightness-110 font-semibold"
              onClick={uploadPost}
            >
              {loading ? t('common:uploading') : t('common:uploadPost')}
            </button>
          </div>
        </div>
      </RModal>
      <RModal
        classNames={{
          modal: 'rounded-lg drop-shadow-md',
          modalContainer: 'overflow-y-hidden flex items-center justify-center',
        }}
        open={success}
        onClose={() => setSuccess(false)}
        showCloseIcon={false}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="my-4 text-lg font-semibold">{t('common:postUploaded')}</div>
        <button
          className="bg-blue-primary text-white w-full py-1 rounded-md hover:brightness-110 font-semibold"
          onClick={() => setSuccess(false)}
        >
          {t('common:cool')}
        </button>
      </RModal>
    </>
  );
}

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
