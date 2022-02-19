import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Header from '../../components/Header';
import LanguageSelect from '../../components/LanguageSelect';
import Post from '../../components/Profile/Post';
import { getPosts } from '../../services/firebase';
import { Post as TPost } from '../../types';

export default function Explore() {
  const [posts, setPosts] = useState<TPost[]>(null);
  const { user, loading } = useRecoilValue(userState);
  const router = useRouter();

  useEffect(() => {
    getPosts().then((docs) => setPosts(docs));
  }, [loading, user, router]);

  return (
    <div>
      <Head>
        <title>Margatsni</title>
      </Head>

      <Header />
      <main className="flex flex-col max-w-4xl mx-auto mt-7 pb-[57px] md:pb-0">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts === null
            ? [...Array(3)].map((_, i) => <Skeleton key={i} className="aspect-square" />)
            : posts.map((post) => <Post key={post.docId} post={post} />)}
        </div>
        <LanguageSelect />
      </main>
    </div>
  );
}
