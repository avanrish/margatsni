import { CheckIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

import { deleteNotificationById } from '../services/firebase';
import notificationText from '../util/notificationText';
import Link from './Link';

export default function Notification({ username, profileImg, type, docId, postId = null }) {
  const { t } = useTranslation('common');

  const href =
    type === 'like' || type === 'comment'
      ? `/p/${postId}`
      : type === 'follow'
      ? `/${username}`
      : '/direct/inbox';

  const handleClick = async (e) => {
    e.preventDefault();
    await deleteNotificationById(docId);
  };

  return (
    <Link href={href} className="flex py-2 px-4 items-center hover:bg-[#FAFAFA] cursor-pointer">
      <div className="relative w-[44px] h-[44px] aspect-square">
        <Image className="rounded-full" alt={username} src={profileImg} layout="fill" />
      </div>
      <div className="flex ml-4 w-full text-sm">
        <div>
          <span className="font-semibold mr-1">{username}</span>
          {notificationText(type, t)}
        </div>
        <CheckIcon className="w-6 ml-auto hover:text-blue-primary" onClick={handleClick} />
      </div>
    </Link>
  );
}
