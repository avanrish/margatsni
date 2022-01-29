import Image from 'next/image';
import { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../../atoms/UserAtom';
import { getImageRef, uploadImage, updateUserImage, deleteImage } from '../../services/firebase';
import useTranslation from 'next-translate/useTranslation';
import ChangeProfilePicture from '../Modals/ChangeProfilePicture';

const defaultImg = '/images/default.png';

export default function ChangePicture({ profileImg, username, userId, setActiveToast }) {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
      const imageRef = getImageRef('avatars', userId);
      const profilePicture = await uploadImage(imageRef, readerEvent.target.result);
      await updateUserImage(userId, profilePicture);
      setUser((prev) => ({ ...prev, user: { ...prev.user, profileImg: profilePicture } }));
      setLoading(false);
      setActiveToast('photoAdded');
    };
  };

  const deletePhoto = async () => {
    if (loading) return;
    setLoading(true);
    if (openModal) setOpenModal(false);
    await deleteImage('avatars', userId);
    await updateUserImage(userId, defaultImg);
    setUser((prev) => ({ ...prev, user: { ...prev.user, profileImg: defaultImg } }));
    setLoading(false);
    setActiveToast('photoRemoved');
  };

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
      <ChangeProfilePicture
        open={openModal}
        close={() => setOpenModal(false)}
        filePicker={() => filePickerRef.current.click()}
        deletePhoto={deletePhoto}
      />
    </>
  );
}
