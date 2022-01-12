/* eslint-disable @next/next/no-img-element */
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { toggleFollow } from '../../services/firebase';
import Unfollow from '../Modals/Unfollow';
import Link from '../Link';
import { userState } from '../../atoms/UserAtom';

export default function Suggestion({ profileImg, fullName, username, uid: targetUserId }) {
  const [followed, setFollowed] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useRecoilValue(userState);
  const { t } = useTranslation('suggestions');

  function followCallback() {
    setFollowed((prev) => !prev);
  }

  return (
    <>
      <div className="flex items-center justify-between mt-3">
        <Link className="block w-10 h-10 rounded-full border p-[2px]" href={`/${username}`}>
          <img className="rounded-full" src={profileImg} alt={fullName} width={38} height={38} />
        </Link>

        <div className="flex-1 ml-4">
          <Link className="block font-semibold text-sm hover:underline" href={`/${username}`}>
            {username}
          </Link>
          <h3 className="text-xs text-gray-primary">{t('recommended')}</h3>
        </div>

        <button
          className={`text-xs font-semibold ${
            followed ? 'text-blue-secondary' : 'text-blue-primary'
          }`}
          onClick={() =>
            followed
              ? setOpen(true)
              : toggleFollow(user.uid, targetUserId, followed, followCallback)
          }
        >
          {t(`common:${followed ? 'following' : 'follow'}`)}
        </button>
      </div>
      <Unfollow
        open={open}
        setOpen={setOpen}
        profileImg={profileImg}
        username={username}
        toggleFollow={() => toggleFollow(user.uid, targetUserId, followed, followCallback)}
      />
    </>
  );
}
