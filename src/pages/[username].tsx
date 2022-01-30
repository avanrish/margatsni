import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { BookmarkIcon, ViewGridIcon } from '@heroicons/react/outline';
import { useRecoilValue } from 'recoil';

import { userState } from '../atoms/UserAtom';
import { getPostsByUserId, toggleFollow, getSavedPosts } from '../services/firebase';
import { getUserDataByUsername } from '../services/firebase-admin';
import Header from '../components/Header';
import LanguageSelect from '../components/LanguageSelect';
import Unfollow from '../components/Modals/Unfollow';
import Buttons from '../components/Profile/Buttons';
import Stats from '../components/Profile/Stats';
import Posts from '../components/Profile/Posts';
import Saved from '../components/Profile/Saved';
import removePrivateData from '../util/removePrivateData';

export default function Username({ profile: initProfile }) {
  const [profile, setProfile] = useState(initProfile);
  const [posts, setPosts] = useState(null);
  const [savedPosts, setSavedPosts] = useState(null);
  const [showPosts, setShowPosts] = useState(true);
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const { t } = useTranslation('profile');
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

  useEffect(() => {
    const getPosts = async () => {
      const posts = await getSavedPosts(user.saved);
      setSavedPosts(posts);
    };
    if (!showPosts && user && savedPosts === null) getPosts();
  }, [savedPosts, showPosts, user]);

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
      <main className="flex flex-col max-w-4xl mx-auto mt-7 pb-[57px] md:pb-0 overflow-hidden">
        <div className="flex mb-8">
          <div className="relative min-w-[77px] h-[77px] sm:min-w-[150px] sm:h-[150px] mx-4 sm:mx-14">
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
            <div className="relative left-[calc(-125px+1rem)] sm:static">
              <div className="font-semibold">{profile.fullName}</div>
              {profile.bio && (
                <div className="w-[calc(100vw-32px)] truncate sm:w-full sm:break-all sm:whitespace-normal">
                  {profile.bio}
                </div>
              )}
              {profile.website && (
                <a
                  className="text-blue-secondary font-semibold"
                  href={profile.website}
                  target="blank"
                  rel="noreferrer"
                >
                  {new URL(profile.website).hostname}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col border-t border-gray-border">
          <div className="flex justify-center space-x-20">
            <div
              className={`posts-saved-btn ${
                showPosts ? 'posts-saved-active' : 'posts-saved-inactive'
              }`}
              onClick={showPosts ? null : () => setShowPosts(true)}
            >
              <ViewGridIcon className="w-5 mr-2" />
              {t('posts', { count: 999999 })}
            </div>
            {user?.username === profile.username && (
              <div
                className={`posts-saved-btn ${
                  !showPosts ? 'posts-saved-active' : 'posts-saved-inactive'
                }`}
                onClick={!showPosts ? null : () => setShowPosts(false)}
              >
                <BookmarkIcon className="w-5 mr-2" />
                {t`common:saved`}
              </div>
            )}
          </div>
          {showPosts ? (
            <Posts
              posts={posts}
              currUserUsername={user?.username}
              profileUsername={profile?.username}
            />
          ) : (
            <Saved posts={savedPosts} />
          )}
        </div>
        <LanguageSelect />
      </main>
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
  removePrivateData(profile);
  return {
    props: {
      profile,
      key: username,
    },
  };
};
