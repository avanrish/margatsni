import useTranslation from 'next-translate/useTranslation';
import Modal from 'react-responsive-modal';

export default function ChangeProfilePicture({ open, close, filePicker, deletePhoto }) {
  const { t } = useTranslation('settings');

  return (
    <Modal
      open={open}
      onClose={close}
      center={true}
      showCloseIcon={false}
      classNames={{
        modal: 'flex flex-col w-full !max-w-xs rounded-lg !p-0 !text-center divide-y text-sm',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
    >
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
    </Modal>
  );
}
