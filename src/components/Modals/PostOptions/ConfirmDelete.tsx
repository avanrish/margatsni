import Modal from 'react-responsive-modal';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import Spinner from '../../Spinner';

export default function ConfirmDelete({ open, close, handleDelete }) {
  const [deleting, setDeleting] = useState(false);
  const { t } = useTranslation('post');
  return (
    <Modal
      open={open}
      onClose={close}
      showCloseIcon={false}
      center={true}
      classNames={{
        modal: 'flex flex-col w-full !max-w-xs rounded-lg !p-0 !text-center divide-y text-sm',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
    >
      {!deleting ? (
        <>
          <div className="flex flex-col py-4">
            <span className="font-semibold text-lg">{t('deletePost')}</span>
            <span className="text-gray-primary">{t('deletePostConsent')}</span>
          </div>
          <div
            className="py-3 font-bold text-red-primary cursor-pointer hover:bg-gray-100 transition-all"
            onClick={() => (setDeleting(true), handleDelete())}
          >
            {t('delete')}
          </div>
          <div className="py-3 cursor-pointer hover:bg-gray-100 transition-all" onClick={close}>
            {t('common:cancel')}
          </div>
        </>
      ) : (
        <div className="flex justify-center py-8">
          <Spinner blue width={48} height={48} />
        </div>
      )}
    </Modal>
  );
}
