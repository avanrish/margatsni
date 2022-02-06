import { PencilAltIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import UserPlaceholder from '../../components/UserPlaceholder';
import NoChatSelected from '../../components/Inbox/NoChatSelected';
import NewMessage from '../../components/Modals/NewMessage';

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, loading } = useRecoilValue(userState);
  const router = useRouter();
  const { t } = useTranslation('inbox');

  if (loading) return <Loading />;
  if (!loading && !user) {
    router.push('/accounts/login');
    return <Loading />;
  }

  return (
    <div>
      <Head>
        <title>
          {modalOpen
            ? `${t`newMessage`}  • Direct`
            : t(chats.length > 0 ? 'chatTitle' : 'inboxTitle')}
        </title>
      </Head>
      <Header />
      <main className="max-w-4xl h-[calc(100vh-98px)] mx-auto my-4 bg-white border rounded-sm grid grid-cols-3">
        <div>
          <div className="py-4 px-5 flex justify-between font-semibold border-b">
            <span />
            <p>{user.username}</p>
            <PencilAltIcon className="w-6 cursor-pointer" onClick={() => setModalOpen(true)} />
          </div>
          <div className="py-2 space-y-4">
            {chats.length === 0
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="px-4">
                    <UserPlaceholder width={56} height={56} />
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="border-l col-span-2">
          {chats.length === 0 ? <NoChatSelected openModal={() => setModalOpen(true)} /> : null}
        </div>
      </main>

      <NewMessage open={modalOpen} close={() => setModalOpen(false)} user={user} />
    </div>
  );
}
