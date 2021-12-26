import Modal from 'react-responsive-modal';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

export default function Unfollow({ open, setOpen, profileImg, username, toggleFollow }) {
  const { t } = useTranslation('common');

  const handleUnfollow = () => {
    toggleFollow();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      showCloseIcon={false}
      center={true}
      classNames={{
        modal: 'flex flex-col w-full !max-w-xs rounded-lg !p-0 !text-center divide-y text-sm',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
    >
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
      <div className="py-3 cursor-pointer">{t`cancel`}</div>
    </Modal>
  );
}
