import { deleteDoc, doc, arrayRemove, updateDoc } from '@firebase/firestore';
import { deleteObject, ref } from '@firebase/storage';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import Modal from 'react-responsive-modal';
import { useSetRecoilState } from 'recoil';

import { clipboardState } from '../../atoms/ClipboardAtom';
import { useAuth } from '../../hooks/useAuth';
import { db, storage } from '../../lib/firebase';
import Link from '../Link';

export default function PostOptionsModal({ open, setOpenOptions, postCreator, docId, getPosts }) {
  const [consentDialog, setConsentDialog] = useState(false);
  const { t } = useTranslation('common');
  const setClipboard = useSetRecoilState(clipboardState);
  const { user } = useAuth();

  const currentUser = user?.displayName?.split('+.')[0];

  useEffect(() => {
    if (!open && consentDialog) window.setTimeout(() => setConsentDialog(false), 220);
  }, [consentDialog, open]);

  const handleDelete = async () => {
    await deleteObject(ref(storage, `posts/${docId}/image`));
    await deleteDoc(doc(db, 'posts', docId));
    const userRef = doc(db, 'users', user.uid);
    updateDoc(userRef, {
      posts: arrayRemove(docId),
    });
    getPosts();
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpenOptions(false)}
      showCloseIcon={false}
      center={true}
      classNames={{
        modal: 'flex flex-col w-full !max-w-xs rounded-lg !p-0 !text-center divide-y text-sm',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
    >
      {!consentDialog ? (
        <>
          {postCreator === currentUser && (
            <div
              className="py-3 font-bold text-red-primary cursor-pointer hover:bg-gray-100 transition-all"
              onClick={() => setConsentDialog(true)}
            >
              {t('delete')}
            </div>
          )}
          <Link href={`/p/${docId}`} className="block py-3 hover:bg-gray-100 outline-none">
            {t('goPost')}
          </Link>
          <div
            className="py-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => setClipboard({ monit: true, post: docId })}
          >
            {t('copyLink')}
          </div>
          <div
            className="py-3 cursor-pointer hover:bg-gray-100 transition-all"
            onClick={() => setOpenOptions(false)}
          >
            {t('cancel')}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col py-4">
            <span className="font-semibold text-lg">{t('deletePost')}</span>
            <span className="text-gray-primary">{t('deleteYouSure')}</span>
          </div>
          <div
            className="py-3 font-bold text-red-primary cursor-pointer hover:bg-gray-100 transition-all"
            onClick={handleDelete}
          >
            {t('delete')}
          </div>
          <div
            className="py-3 cursor-pointer hover:bg-gray-100 transition-all"
            onClick={() => setOpenOptions(false)}
          >
            {t('cancel')}
          </div>
        </>
      )}
    </Modal>
  );
}
