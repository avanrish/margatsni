import { CameraIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import { Modal } from 'react-responsive-modal';

export default function SuccessModal({ open, close }) {
  const { t } = useTranslation();
  return (
    <Modal
      classNames={{
        modal: 'rounded-lg drop-shadow-md',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
      open={open}
      onClose={close}
      showCloseIcon={false}
    >
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div className="my-4 text-lg font-semibold">{t('common:postUploaded')}</div>
      <button
        className="bg-blue-primary text-white w-full py-1 rounded-md hover:brightness-110 font-semibold"
        onClick={close}
      >
        {t('common:cool')}
      </button>
    </Modal>
  );
}
