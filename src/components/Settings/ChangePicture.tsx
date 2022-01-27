import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../../atoms/UserAtom';
import { getImageRef, uploadImage, updateUserImage } from '../../services/firebase';
import useTranslation from 'next-translate/useTranslation';
import Toast from './Toast';
import ChangeProfilePicture from '../Modals/ChangeProfilePicture';

const defaultImg = '/images/default.png';

export default function ChangePicture({ profileImg, username, userId }) {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const setUser = useSetRecoilState(userState);
  const filePickerRef = useRef(null);
  const { t } = useTranslation('settings');

  const handleUpload = (e) => {
    if (loading) return;
    const reader = new FileReader();
    if (e.target.files[0]) {
      setLoading(true);
      if (openModal) setOpenModal(false);
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = async (readerEvent) => {
      const imageRef = getImageRef(username, 'avatars');
      const profilePicture = await uploadImage(imageRef, readerEvent.target.result);
      await updateUserImage(userId, profilePicture);
      setUser((prev) => ({ ...prev, user: { ...prev.user, profileImg: profilePicture } }));
      setLoading(false);
      setActiveToast('photoAdded');
    };
  };

  useEffect(() => {
    if (activeToast && typeof window !== 'undefined')
      window.setTimeout(() => setActiveToast(null), 2000);
  }, [activeToast]);

  return (
    <>
      <div className="flex items-center">
        <div className="w-32 mx-8 font-semibold flex items-center justify-end">
          {loading ? (
            <div className="-mt-2">
              <Skeleton borderRadius={999} width={38} height={38} />
            </div>
          ) : (
            <Image
              className="rounded-full cursor-pointer"
              src={profileImg}
              alt=""
              width={38}
              height={38}
              onClick={
                profileImg === defaultImg
                  ? () => filePickerRef.current.click()
                  : () => setOpenModal(true)
              }
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-lg">{username}</span>
          <span
            className="text-sm font-semibold text-blue-primary cursor-pointer"
            onClick={
              profileImg === defaultImg
                ? () => filePickerRef.current.click()
                : () => setOpenModal(true)
            }
          >
            {t`changeProfilePhoto`}
          </span>
        </div>
        <input type="file" ref={filePickerRef} onChange={handleUpload} hidden />
      </div>
      <Toast text={activeToast} />
      <ChangeProfilePicture
        open={openModal}
        close={() => setOpenModal(false)}
        filePicker={() => filePickerRef.current.click()}
      />
    </>
  );
}
