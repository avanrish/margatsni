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
  const { t } = useTranslation('post');
  return (
    <div className="px-5 py-3 truncate">
      {caption && (
        <div className="space-x-2 max-w-full overflow-hidden flex-wrap">
          {!homePage && (
            <Link className="inline-block align-middle relative h-7 w-7" href={`/${username}`}>
              <Image src={profileImg} alt={username} layout="fill" className="rounded-full" />
            </Link>
          )}
          <Link
            className="inline-block align-middle font-semibold hover:underline"
            href={`/${username}`}
          >
            {username}
          </Link>
          <span className="align-middle whitespace-pre-wrap pr-2">{caption}</span>
        </div>
      )}
      {homePage && initComments.length > 5 && (
        <Link className="block text-sm text-gray-primary" href={`/p/${postId}`}>
          {t('seeAllComments', { count: initComments.length })}
        </Link>
      )}
    </div>
  );
}
