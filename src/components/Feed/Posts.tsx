import { EmojiHappyIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../../atoms/UserAtom';
import { getPostsOfFollowedUsers } from '../../services/firebase';
import Post from '../Post';
import { Post as TPost } from '../../types';

export default function Posts() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useRecoilValue(userState);
  const { t } = useTranslation('post');

  const getPosts = useCallback(async () => {
    const docs = await getPostsOfFollowedUsers([...user.following, user.uid]);
    setPosts(docs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="pb-[57px] md:pb-0 my-4 space-y-4">
      {loading ? (
        <div className="bg-white my-7 border rounded-sm">
          <div className="flex items-center p-5">
            <Skeleton className="mr-3" borderRadius={999} width={48} height={48} />
            <Skeleton width={100} />
          </div>
          <Skeleton height={500} />
          <div className="flex items-center p-4">
            <EmojiHappyIcon className="h-7" />
            <input
              type="text"
              className="border-none flex-1 focus:ring-0"
              placeholder={t('commentPlaceholder')}
            />
            <button
              type="submit"
              disabled={true}
              className={`font-semibold text-blue-400 opacity-50 cursor-default`}
            >
              {t('sendComment')}
            </button>
          </div>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post, i) => (
          <Post
            key={post.docId}
            userId={post.uid}
            postId={post.docId}
            username={post.username}
            userImg={post.profileImg}
            img={post.image}
            caption={post.caption}
            likes={post.likes}
            comments={post.comments.reverse()}
            timestamp={post.timestamp.seconds}
            getPosts={getPosts}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))
      ) : (
        <div className="mt-8 text-center text-lg">{t('noPosts')}</div>
      )}
    </div>
  );
}
