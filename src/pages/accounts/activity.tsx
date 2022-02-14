import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Notification from '../../components/Notification';
import { getNotifications } from '../../services/firebase';

export default function Activity() {
  const [notifications, setNotifications] = useState([]);
  const { user, loading } = useRecoilValue(userState);
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => getNotifications(user?.uid, setNotifications), [user?.uid]);

  if (loading) return <Loading />;
  if (!loading && !user) {
    router.push({ pathname: '/accounts/login', query: { next: router.asPath } });
    return <Loading />;
  }

  return (
    <div>
      <Head>
        <title>Margatsni</title>
      </Head>
      <Header />
      <main className="flex flex-col mx-auto mt-7 pb-[57px] md:pb-0 max-w-lg">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Notification
              key={n.docId}
              username={n.senderUsername}
              profileImg={n.senderProfileImg}
              type={n.type}
              docId={n.docId}
              postId={n.postId}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4 space-y-2">
            <Image src="/images/heart.png" alt="" width={48} height={48} />
            <p className="text-lg">{t`noNotifications`}</p>
          </div>
        )}
      </main>
    </div>
  );
}
