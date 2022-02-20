import { CameraIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import CustomModal from '../../CustomModal';

export default function SuccessModal({ open, close }) {
  const { t } = useTranslation();
  return (
    <CustomModal open={open} onClose={close} showCloseIcon={false}>
      <div className="p-4 space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="text-lg font-semibold">{t('common:postUploaded')}</div>
        <button
          className="bg-blue-primary text-white w-40 py-1 rounded-md hover:brightness-110 font-semibold"
          onClick={close}
        >
          {t('common:cool')}
        </button>
      </div>
    </CustomModal>
  );
}
