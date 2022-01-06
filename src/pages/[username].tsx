import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { BookmarkIcon, CameraIcon, ViewGridIcon } from '@heroicons/react/outline';
import { ChatIcon, HeartIcon, UserIcon } from '@heroicons/react/solid';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Skeleton from 'react-loading-skeleton';

import { userState } from '../atoms/UserAtom';
import { logInDialogState } from '../atoms/LogInDialogAtom';
import { getPostsByUserId, getUserDataByUsername, toggleFollow } from '../services/firebase';
import Header from '../components/Header';
import Link from '../components/Link';
import LanguageSelect from '../components/LanguageSelect';
import Unfollow from '../components/Modals/Unfollow';

export default function Username() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const setLoginDialog = useSetRecoilState(logInDialogState);
  const { t } = useTranslation('common');
  const { user } = useRecoilValue(userState);
  const router = useRouter();

  useEffect(() => {
    getUserDataByUsername(router.query.username as string).then((data) => {
      if (!data) router.push('/404', router.asPath);
      else {
        setProfile(data);
        setLoading(false);
      }
    });
  }, [router]);

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
        <title>
          {loading ? 'Margatsni' : `${profile.fullName} (@${profile.username}) • Margatsni`}{' '}
        </title>
      </Head>
      <Header />
      {!loading ? (
        <>
          <main className="flex flex-col max-w-4xl mx-auto mt-7">
            <div className="flex mb-8">
              <div className="relative w-[77px] h-[77px] sm:w-[150px] sm:h-[150px] mx-4 sm:mx-14">
                <Image
                  className="rounded-full"
                  src={profile?.profileImg || ''}
                  alt=""
                  layout="fill"
                />
              </div>
              <div className="ml-4 sm:ml-8 flex flex-col space-y-4">
                <div className="flex flex-col space-y-3 xs:space-y-0 xs:flex-row xs:space-x-6 xs:items-center">
                  <p className="font-thin text-2xl">{profile.username}</p>
                  {user?.username === profile.username ? (
                    <Link href="#" className="profile-button">{t`editProfile`}</Link>
                  ) : following ? (
                    <div className="flex">
                      <button className="profile-button mr-2">{t`message`}</button>
                      <button className="profile-button flex items-center" onClick={handleFollow}>
                        <UserIcon className="w-4" />
                        <span className="text-green-500">&#10003;</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={user ? handleFollow : () => setLoginDialog(true)}
                      className="profile-button !text-white !bg-blue-primary"
                    >{t`follow`}</button>
                  )}
                </div>
                <div className="xs:flex space-x-10 hidden">
                  <div>
                    <span className="font-semibold mr-1">{profile.posts.length}</span>
                    {profile.posts.length === 1 ? t`postSingular` : t`posts`}
                  </div>
                  <div>
                    <span className="font-semibold mr-1">{profile.followers.length}</span>
                    {profile.followers.length === 1 ? t`follower` : t`followers`}
                  </div>
                  <div>
                    <span className="font-semibold mr-1">{profile.following.length}</span>
                    {t`profileFollowing`}
                  </div>
                </div>
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
                    <Link
                      href={`/p/${post.id}`}
                      key={post.id}
                      className="relative aspect-square cursor-pointer"
                    >
                      <div className="z-10 absolute w-full h-full bg-black/30 flex items-center justify-center text-white space-x-6 opacity-0 hover:opacity-100 transition duration-300">
                        <span className="flex items-center">
                          <HeartIcon className="w-8 mr-1" />
                          {post.data().likes.length}
                        </span>
                        <span className="flex items-center">
                          <ChatIcon className="w-8 mr-1" />
                          {post.data().comments.length}
                        </span>
                      </div>
                      <Image draggable={false} src={post.data().image} alt="" layout="fill" />
                    </Link>
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
            profileImg={profile?.profileImg}
            username={profile?.username}
            toggleFollow={() => toggleFollow(user.uid, profile.uid, following, followCallback)}
          />
        </>
      ) : (
        <div className="max-w-4xl flex mx-auto mt-7">
          <div className="w-[77px] h-[77px] sm:w-[150px] sm:h-[150px] mx-4 sm:mx-14">
            <Skeleton width="100%" height="100%" borderRadius={999} />
          </div>
          <div className="ml-4 sm:ml-8 flex flex-col space-y-4">
            <Skeleton width={125} height={32} />
            <Skeleton width={200} height={24} />
            <Skeleton width={100} height={24} />
          </div>
        </div>
      )}
    </div>
  );
}
