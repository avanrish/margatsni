import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

import Post from './Post';

export default function Saved({ posts }) {
  const { t } = useTranslation('profile');
  return posts === null ? (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
    </div>
  ) : posts.length > 0 ? (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center my-2">
      <Image src="/images/saved.png" alt="Saved Icon" width={62} height={62} />
      <p className="my-4 font-thin text-3xl">{t`save`}</p>
      <p className="max-w-xs text-center text-sm">{t`saveDescription`}</p>
    </div>
  );
}
