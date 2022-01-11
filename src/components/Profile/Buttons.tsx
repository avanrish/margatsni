import { UserIcon } from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import { useSetRecoilState } from 'recoil';

import { logInDialogState } from '../../atoms/LogInDialogAtom';
import Link from '../Link';

export default function Buttons({ username, profileUsername, following, handleFollow, loading }) {
  const setLoginDialog = useSetRecoilState(logInDialogState);
  const { t } = useTranslation('profile');

  return (
    <div className="flex flex-col space-y-3 xs:space-y-0 xs:flex-row xs:space-x-6 xs:items-center">
      <p className="font-thin text-2xl">{profileUsername}</p>
      {username === profileUsername ? (
        <Link href="#" className="profile-button">{t`editProfile`}</Link>
      ) : following ? (
        <div className="flex">
          <button className="profile-button mr-2">{t`message`}</button>
          <button className="profile-button flex items-center" onClick={handleFollow}>
            <UserIcon className="w-4" />
            <span className="text-green-500">&#10003;</span>
          </button>
        </div>
      ) : (
        !loading && (
          <button
            onClick={username ? handleFollow : () => setLoginDialog(true)}
            className="profile-button !text-white !bg-blue-primary"
          >{t`common:follow`}</button>
        )
      )}
    </div>
  );
}
