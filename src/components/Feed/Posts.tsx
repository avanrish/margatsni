import { EmojiHappyIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../../atoms/UserAtom';
import { getPostsOfFollowedUsers } from '../../services/posts.firebase';
import Post from '../Post';

export default function Posts() {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useRecoilValue(userState);
  const { t } = useTranslation('home');

  const getPosts = useCallback(async () => {
    const { docs } = await getPostsOfFollowedUsers([...user.following, user.uid]);
    setPosts(docs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div>
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
              placeholder={t('common:addComment')}
            />
            <button
              type="submit"
              disabled={true}
              className={`font-semibold text-blue-400 opacity-50 cursor-default`}
            >
              {t('common:post')}
            </button>
          </div>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            userId={post.data().uid}
            postId={post.id}
            username={post.data().username}
            userImg={post.data().profileImg}
            img={post.data().image}
            caption={post.data().caption}
            likes={post.data().likes}
            comments={post.data().comments.reverse()}
            timestamp={post.data().timestamp.seconds}
            getPosts={getPosts}
          />
        ))
      ) : (
        <div className="mt-8 text-center text-lg">{t('noPosts')}</div>
      )}
    </div>
  );
}
