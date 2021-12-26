import { DotsHorizontalIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { getMyFollowings, toggleFollow } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import Link from '../Link';
import Unfollow from '../Modals/Unfollow';

export default function PostHeader({
  username,
  userImg,
  setOpenOptions,
  postId = null,
  userId = null,
}) {
  const [following, setFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation('common');

  useEffect(() => {
    const checkIfFollowing = async () => {
      const followings = await getMyFollowings(user.uid);
      const isFollowing = followings.filter((follow) => follow === userId).length > 0;
      setFollowing(isFollowing);
    };
    if (postId) checkIfFollowing();
  }, [postId, user.uid, userId]);

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
      {postId && (
        <>
          <p className="mx-2">•</p>
          <p
            className="cursor-pointer font-semibold"
            onClick={() =>
              following ? setOpen(true) : toggleFollow(user.uid, userId, following, followCallback)
            }
          >
            {following ? t`following` : t`follow`}
          </p>
          <Unfollow
            open={open}
            setOpen={setOpen}
            profileImg={userImg}
            username={username}
            toggleFollow={() => toggleFollow(user.uid, userId, following, followCallback)}
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
