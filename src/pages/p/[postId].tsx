import Head from 'next/head';

import Header from '../../components/Header';
import Post from '../../components/Post';
import ClipboardMonit from '../../components/ClipboardMonit';
import { getPostDataById } from '../../services/posts.firebase-admin';

export default function PostId({ post, postId, timestamp }) {
  const title = post.caption
    ? `${post.username} on Margatsni: "${post.caption}"`
    : `${post.username} on Margatsni.`;

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <div className="max-w-6xl pb-14 mx-auto">
        <Post
          postId={postId}
          userId={post.uid}
          username={post.username}
          userImg={post.profileImg}
          comments={post.comments}
          caption={post.caption}
          img={post.image}
          likes={post.likes}
          timestamp={timestamp}
        />
      </div>

      <ClipboardMonit />
    </div>
  );
}

export const getServerSideProps = async ({ query: { postId } }) => {
  const post = await getPostDataById(postId);
  if (!post)
    return {
      notFound: true,
    };
  const timestamp = post.timestamp.seconds;
  delete post.timestamp; // Timestamp cannot be serialized as JSON
  return {
    props: {
      post,
      postId,
      timestamp,
      key: postId,
    },
  };
};
