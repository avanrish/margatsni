import useTranslation from 'next-translate/useTranslation';
import Modal from 'react-responsive-modal';
import { useSetRecoilState } from 'recoil';

import { clipboardState } from '../../../atoms/ClipboardAtom';
import Link from '../../Link';

export default function Options({
  open,
  close,
  postCreator,
  currentUser,
  setConsentDialog,
  docId,
}) {
  const setClipboard = useSetRecoilState(clipboardState);
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
      {postCreator === currentUser && (
        <div
          className="py-3 font-bold text-red-primary cursor-pointer hover:bg-gray-100 transition-all"
          onClick={() => (setConsentDialog(true), close())}
        >
          {t('delete')}
        </div>
      )}
      <Link href={`/p/${docId}`} className="block py-3 hover:bg-gray-100 outline-none">
        {t('goToPost')}
      </Link>
      <div
        className="py-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => setClipboard({ monit: true, post: docId })}
      >
        {t('copyLink')}
      </div>
      <div className="py-3 cursor-pointer hover:bg-gray-100 transition-all" onClick={close}>
        {t('common:cancel')}
      </div>
    </Modal>
  );
}
