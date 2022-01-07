import { DotsHorizontalIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { toggleFollow } from '../../services/users.firebase';
import Link from '../Link';
import Unfollow from '../Modals/Unfollow';

export default function PostHeader({
  username,
  userImg,
  setOpenOptions,
  postId = null,
  userId = null,
  currUser,
  setLoginDialog,
}) {
  const [following, setFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const checkIfFollowing = async () => {
      const isFollowing = currUser?.following.filter((follow) => follow === userId).length > 0;
      setFollowing(isFollowing);
    };
    if (postId) checkIfFollowing();
  }, [postId, userId, currUser?.following]);

  function followCallback() {
    setFollowing((prev) => !prev);
  }

  return (
    <div className="flex items-center px-5 py-3 border-b">
      <Link className="block rounded-full border h-12 w-12 p-1 mr-3" href={`/${username}`}>
        <Image
          className="rounded-full "
          src={userImg || '/'}
          alt=""
          height={48}
          width={48}
          objectFit="contain"
        />
      </Link>

      <Link className="block flex-1 font-semibold hover:underline max-w-max" href={`/${username}`}>
        {username}
      </Link>
      {postId && currUser?.username !== username && (
        <>
          <p className="mx-2">•</p>
          <p
            className="cursor-pointer font-semibold"
            onClick={() => {
              if (!currUser) setLoginDialog(true);
              else if (following) setOpen(true);
              else toggleFollow(currUser.uid, userId, following, followCallback);
            }}
          >
            {following ? t`following` : t`follow`}
          </p>
          <Unfollow
            open={open}
            setOpen={setOpen}
            profileImg={userImg}
            username={username}
            toggleFollow={() => toggleFollow(currUser.uid, userId, following, followCallback)}
          />
        </>
      )}

      <DotsHorizontalIcon
        className="h-5 cursor-pointer ml-auto"
        onClick={() => setOpenOptions(true)}
      />
    </div>
  );
}
