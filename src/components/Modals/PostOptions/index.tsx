import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../../atoms/UserAtom';
import { deleteImage, deletePost, updateUserPostsArray } from '../../../services/firebase';
import ConfirmDelete from './ConfirmDelete';
import Options from './Options';

export default function PostOptionsModal({ open, setOpenOptions, postCreator, docId, getPosts }) {
  const [consentDialog, setConsentDialog] = useState(false);
  const { user } = useRecoilValue(userState);
  const router = useRouter();

  const handleDelete = async () => {
    await deleteImage(docId);
    await deletePost(docId);
    await updateUserPostsArray('remove', user.uid, docId);
    if (router.pathname !== '/') router.push('/');
    else getPosts();
  };

  return (
    <>
      <Options
        open={open}
        close={() => setOpenOptions(false)}
        postCreator={postCreator}
        currentUser={user?.username}
        setConsentDialog={setConsentDialog}
        docId={docId}
      />
      <ConfirmDelete
        open={consentDialog}
        close={() => setConsentDialog(false)}
        handleDelete={handleDelete}
      />
    </>
  );
}