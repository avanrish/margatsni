import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

import CustomModal from '../CustomModal';

export default function Unfollow({ open, setOpen, profileImg, username, toggleFollow }) {
  const { t } = useTranslation('common');

  const handleUnfollow = () => {
    toggleFollow();
    setOpen(false);
  };

  return (
    <CustomModal open={open} onClose={() => setOpen(false)} showCloseIcon={false} center={true}>
      <div className="mt-6">
        <Image className="rounded-full" src={profileImg} alt={username} width={90} height={90} />
        <p className="py-6">{t('unfollowConsentMsg', { user: username })}</p>
      </div>
      <div
        className="py-3 font-semibold text-red-primary hover:bg-gray-100 cursor-pointer"
        onClick={handleUnfollow}
      >
        {t`unfollow`}
      </div>
      <div className="py-3 cursor-pointer" onClick={() => setOpen(false)}>{t`cancel`}</div>
    </CustomModal>
  );
}
