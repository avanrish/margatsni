import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import Header from '../../components/Header';
import { getPostById } from '../../services/firebase';
import Post from '../../components/Post';
import ClipboardMonit from '../../components/ClipboardMonit';
import Loading from '../../components/Post/Loading';

export default function PostId() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getPosts = useCallback(() => {
    getPostById(router.query.postId as string).then((data) => {
      if (!data) router.push('/404', router.asPath);
      else {
        setPost(data);
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    getPosts();
  }, [router, getPosts]);

  return (
    <div>
      <Head>
        <title>
          {loading ? 'Margatsni' : `${post?.username} on Margatsni: "${post?.caption}"`}
        </title>
      </Head>
      <Header />
      {loading ? (
        <Loading />
      ) : (
        post && (
          <div className="max-w-6xl pb-14 mx-auto">
            <Post
              postId={router?.query?.postId as string}
              userId={post.uid}
              username={post.username}
              userImg={post.profileImg}
              comments={post.comments}
              caption={post.caption}
              img={post.image}
              likes={post.likes}
              timestamp={post.timestamp.seconds}
              getPosts={getPosts}
            />
          </div>
        )
      )}

      <ClipboardMonit />
    </div>
  );
}
