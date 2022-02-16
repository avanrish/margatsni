import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import { userState } from '../atoms/UserAtom';
import Feed from '../components/Feed';
import Header from '../components/Header';
import Loading from '../components/Loading';

const Toast = dynamic(() => import('../components/Toast'));

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
    <div className="min-h-screen">
      <Head>
        <title>Margatsni</title>
      </Head>

      <Header />
      <Feed />
      <Toast />
    </div>
  );
};

export default Home;
