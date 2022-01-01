import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import { userState } from '../atoms/UserAtom';
import ClipboardMonit from '../components/ClipboardMonit';
import Feed from '../components/Feed';
import Header from '../components/Header';
import Loading from '../components/Loading';

const Home: NextPage = () => {
  const { user, loading } = useRecoilValue(userState);
  const router = useRouter();

  // First the app waits for firebase
  if (loading) return <Loading />;
  // Then it redirects client to login page if user is not logged in
  if (!user) {
    router.push('/accounts/login', '/');
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Margatsni</title>
      </Head>

      <Header />
      <Feed />
      <ClipboardMonit />
    </div>
  );
};

export default Home;
