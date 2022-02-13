import { UserIcon } from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import { logInDialogState } from '../../atoms/LogInDialogAtom';
import Spinner from '../Spinner';
import { createChat } from '../../services/firebase';
import Link from '../Link';

export default function Buttons({ user, profile, following, handleFollow, loading }) {
  const setLoginDialog = useSetRecoilState(logInDialogState);
  const [inProgress, setInProgress] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('profile');

  const handleCreateChat = async () => {
    setInProgress(true);
    await createChat([
      {
        username: profile.username,
        profileImg: profile.profileImg.match(/.*media/)[0],
        fullName: profile.fullName,
        uid: profile.uid,
      },
      {
        username: user.username,
        profileImg: user.profileImg.match(/.*media/)[0],
        fullName: user.fullName,
        uid: user.uid,
      },
    ]);
    setInProgress(false);
    router.push('/direct/inbox');
  };

  return (
    <div className="flex flex-col space-y-3 xs:space-y-0 xs:flex-row xs:space-x-6 xs:items-center">
      <p className="font-thin text-2xl">{profile?.username}</p>
      {user?.username === profile?.username ? (
        <Link href="/accounts/edit" className="profile-button">{t`editProfile`}</Link>
      ) : following ? (
        <div className="flex">
          <button className="profile-button mr-2" onClick={handleCreateChat}>
            {inProgress ? <Spinner blue /> : t`message`}
          </button>
          <button className="profile-button flex items-center" onClick={handleFollow}>
            <UserIcon className="w-4" />
            <span className="text-green-500">&#10003;</span>
          </button>
        </div>
      ) : (
        !loading && (
          <button
            onClick={user?.username ? handleFollow : () => setLoginDialog(true)}
            className="profile-button !text-white !bg-blue-primary"
          >{t`common:follow`}</button>
        )
      )}
    </div>
  );
}
