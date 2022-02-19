import { CameraIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

import Post from './Post';

export default function Posts({ posts, currUserUsername, profileUsername }) {
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
        <Post key={post.docId} post={post} />
      ))}
    </div>
  ) : currUserUsername === profileUsername ? (
    <div className="flex flex-col-reverse md:flex-row items-center">
      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]">
        <Image src="/images/sampleImage.jpg" alt="" layout="fill" />
      </div>
      <div className="flex flex-col mx-auto text-center text-lg my-8 md:my-0">
        <span className="font-semibold">{t`noPostsCurrUser1`}</span>
        <span>{t`noPostsCurrUser2`}</span>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center my-12">
      <CameraIcon className="w-7 mb-12" />
      <span className="font-thin text-3xl">{t`noPostsAnotherUser`}</span>
    </div>
  );
}
