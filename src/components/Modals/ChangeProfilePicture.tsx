import useTranslation from 'next-translate/useTranslation';

import CustomModal from '../CustomModal';

export default function ChangeProfilePicture({ open, close, filePicker, deletePhoto }) {
  const { t } = useTranslation('settings');

  return (
    <CustomModal open={open} onClose={close} center={true} showCloseIcon={false}>
      <div className="divide-y divide-gray-border">
        <p className="text-lg py-6 font-semibold">{t`changeProfilePhoto`}</p>
        <p
          className="py-4 text-blue-primary font-bold hover:bg-gray-50 cursor-pointer"
          onClick={filePicker}
        >{t`uploadPhoto`}</p>
        <p
          className="py-4 text-red-primary font-bold hover:bg-gray-50 cursor-pointer"
          onClick={deletePhoto}
        >{t`removePhoto`}</p>
        <p
          className="py-4 font-normal hover:bg-gray-50 cursor-pointer"
          onClick={close}
        >{t`common:cancel`}</p>
      </div>
    </CustomModal>
  );
}
