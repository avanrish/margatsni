/* eslint-disable @next/next/no-img-element */
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import cn from 'classnames';

import { toggleFollow } from '../../services/firebase';
import Unfollow from '../Modals/Unfollow';
import Link from '../Link';
import { userState } from '../../atoms/UserAtom';

export default function Suggestion({
  profileImg,
  fullName = null,
  username,
  uid: targetUserId,
  explore = false,
}) {
  const [followed, setFollowed] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useRecoilValue(userState);
  const { t } = useTranslation('suggestions');

  function followCallback() {
    setFollowed((prev) => !prev);
  }

  const followClass = cn('font-semibold', {
    'text-xs': !explore,
    'text-blue-secondary': !explore && followed,
    'text-blue-primary': !explore && !followed,
    login_btn: explore && !followed,
    'profile-button': explore && followed,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Link className="block w-10 h-10 rounded-full border p-[2px]" href={`/${username}`}>
          <img className="rounded-full" src={profileImg} alt={username} width={38} height={38} />
        </Link>

        <div className="flex-1 ml-4">
          <Link className="block font-semibold text-sm hover:underline" href={`/${username}`}>
            {username}
          </Link>
          <h3 className="text-xs text-gray-primary">{fullName || t('recommended')}</h3>
        </div>

        <button
          className={followClass}
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
