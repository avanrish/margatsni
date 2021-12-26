import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

import Link from '../Link';

export default function Caption({
  username,
  caption,
  initComments,
  postId,
  homePage,
  profileImg = '/',
}) {
  const { t } = useTranslation();
  return (
    <div className="px-5 py-3 truncate">
      {caption && (
        <div className="flex items-center space-x-2">
          {!homePage && (
            <Link className="block relative h-7 w-7" href={`/${username}`}>
              <Image src={profileImg} alt={username} layout="fill" className="rounded-full" />
            </Link>
          )}
          <Link className="font-semibold hover:underline" href={`/${username}`}>
            {username}
          </Link>
          <span>{caption}</span>
        </div>
      )}
      {homePage && initComments.length > 5 && (
        <Link className="block text-sm text-gray-primary" href={`/p/${postId}`}>
          {t('home:seeAllComments', { count: initComments.length })}
        </Link>
      )}
    </div>
  );
}
