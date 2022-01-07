import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { BookmarkIcon, CameraIcon, ViewGridIcon } from '@heroicons/react/outline';
import { useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../atoms/UserAtom';
import { toggleFollow } from '../services/users.firebase';
import { getPostsByUserId } from '../services/posts.firebase';
import Header from '../components/Header';
import LanguageSelect from '../components/LanguageSelect';
import Unfollow from '../components/Modals/Unfollow';
import { getUserDataByUsername } from '../services/users.firebase-admin';
import Buttons from '../components/Profile/Buttons';
import Stats from '../components/Profile/Stats';
import Post from '../components/Profile/Post';

export default function Username({ profile: initProfile }) {
  const [profile, setProfile] = useState(initProfile);
  const [posts, setPosts] = useState(null);
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const { t } = useTranslation('common');
  const { user, loading } = useRecoilValue(userState);

  useEffect(() => {
    if (user && profile) setFollowing(profile.followers.filter((id) => id === user.uid).length > 0);
  }, [user, profile]);

  useEffect(() => {
    const getPosts = async () => {
      const posts = await getPostsByUserId(profile.uid);
      setPosts(posts.docs);
    };
    if (profile) getPosts();
  }, [profile]);

  const handleFollow = () => {
    if (following) setOpen(true);
    else toggleFollow(user.uid, profile.uid, following, followCallback);
  };

  function followCallback() {
    let newFollowers = [];
    if (following) newFollowers = profile.followers.filter((id) => id !== user?.uid);
    else newFollowers = [...profile.followers, user?.uid];
    setProfile((prev) => ({ ...prev, followers: newFollowers }));
    setFollowing((prev) => !prev);
  }

  return (
    <div>
      <Head>
        <title>{`${profile.fullName} (@${profile.username}) • Margatsni`}</title>
      </Head>
      <Header />
      <main className="flex flex-col max-w-4xl mx-auto mt-7">
        <div className="flex mb-8">
          <div className="relative w-[77px] h-[77px] sm:w-[150px] sm:h-[150px] mx-4 sm:mx-14">
            <Image className="rounded-full" src={profile.profileImg} alt="" layout="fill" />
          </div>
          <div className="ml-4 sm:ml-8 flex flex-col space-y-4">
            <Buttons
              username={user?.username}
              loading={loading}
              profileUsername={profile.username}
              following={following}
              handleFollow={handleFollow}
            />
            <Stats profile={profile} />
            <div className="font-semibold">{profile.fullName}</div>
          </div>
        </div>
        <div className="flex flex-col border-t border-gray-border">
          <div className="flex justify-center space-x-20">
            <div className="py-3 uppercase text-xs border-t border-black -mt-[1px] flex items-center cursor-pointer">
              <ViewGridIcon className="w-5 mr-2" />
              {t`Posts`}
            </div>
            {user?.username === profile.username && (
              <div className="py-3 uppercase text-xs text-gray-primary -mt-[1px] flex items-center cursor-pointer">
                <BookmarkIcon className="w-5 mr-2" />
                {t`saved`}
              </div>
            )}
          </div>
          {posts === null ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ) : user?.username === profile.username ? (
            <div className="flex items-center">
              <div className="relative w-[380px] h-[380px]">
                <Image src="/images/sampleImage.jpg" alt="" layout="fill" />
              </div>
              <div className="flex flex-col mx-auto text-center text-lg">
                <span className="font-semibold">{t`noPhotos1`}</span>
                <span>{t`noPhotos2`}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center my-12">
              <CameraIcon className="w-7 mb-12" />
              <span className="font-thin text-3xl">{t`noPosts`}</span>
            </div>
          )}
        </div>
      </main>
      <LanguageSelect />
      <Unfollow
        open={open}
        setOpen={setOpen}
        profileImg={profile.profileImg}
        username={profile.username}
        toggleFollow={() => toggleFollow(user.uid, profile.uid, following, followCallback)}
      />
    </div>
  );
}

export const getServerSideProps = async ({ query: { username } }) => {
  const profile = await getUserDataByUsername(username);
  if (!profile)
    return {
      notFound: true,
    };
  delete profile.timestamp; // Timestamp cannot be serialized as JSON
  return {
    props: {
      profile,
      key: username,
    },
  };
};
