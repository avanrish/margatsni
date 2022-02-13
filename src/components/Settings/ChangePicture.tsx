import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../../atoms/UserAtom';
import {
  getImageRef,
  uploadImage,
  updateUserImage,
  getCustomMetadata,
} from '../../services/firebase';
import useTranslation from 'next-translate/useTranslation';
import ChangeProfilePicture from '../Modals/ChangeProfilePicture';
import toDataURL from '../../util/toDataURL';

export default function ChangePicture({ profileImg, username, userId, setActiveToast }) {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const setUser = useSetRecoilState(userState);
  const filePickerRef = useRef(null);
  const { t } = useTranslation('settings');

  useEffect(() => {
    const isUsersPictureDefault = async () => {
      const ref = getImageRef('avatars', userId);
      const metadata = await getCustomMetadata(ref);
      setIsDefault(metadata.customMetadata?.isDefault === 'true');
    };
    isUsersPictureDefault();
  }, [userId]);

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
      setIsDefault(false);
      setActiveToast('photoAdded');
      filePickerRef.current.value = null;
    };
  };

  const deletePhoto = async () => {
    if (loading) return;
    setLoading(true);
    if (openModal) setOpenModal(false);
    const imageRef = getImageRef('avatars', userId);
    const defaultImage = await toDataURL('/images/default.png');
    const imgUrl = await uploadImage(imageRef, defaultImage, true);
    await updateUserImage(userId, imgUrl);
    setUser((prev) => ({ ...prev, user: { ...prev.user, profileImg: imgUrl } }));
    setLoading(false);
    setIsDefault(true);
    setActiveToast('photoRemoved');
  };

  return (
    <>
      <div className="flex mx-8 md:mx-0 md:items-center">
        <div className="md:w-32 md:mx-8 font-semibold flex items-center justify-end">
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
              onClick={isDefault ? () => filePickerRef.current.click() : () => setOpenModal(true)}
            />
          )}
        </div>
        <div className="flex flex-col ml-4 md:ml-0">
          <span className="text-lg">{username}</span>
          <span
            className="text-sm font-semibold text-blue-primary cursor-pointer"
            onClick={isDefault ? () => filePickerRef.current.click() : () => setOpenModal(true)}
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
