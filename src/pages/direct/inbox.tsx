import { PencilAltIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import UserPlaceholder from '../../components/UserPlaceholder';
import NoChatSelected from '../../components/Inbox/NoChatSelected';
import NewChat from '../../components/Modals/NewChat';
import { getChatsSubscribe } from '../../services/firebase';
import ChatRoom from '../../components/Inbox/ChatRoom';
import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import Chat from '../../components/Inbox/Chat';
import inboxTitle from '../../util/inboxTitle';
import { Chat as TChat } from '../../types';

export default function Inbox() {
  const [chats, setChats] = useState<TChat[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const { user, loading } = useRecoilValue(userState);
  const isMobile = useRecoilValue(mobileDeviceState);
  const router = useRouter();
  const { t } = useTranslation('inbox');

  useEffect(
    () => getChatsSubscribe(user, setChats, selectedChat, setSelectedChat),
    [loading, user, selectedChat]
  );

  useEffect(() => {
    setSelectedTab(0);
  }, [selectedChat]);

  if (loading) return <Loading />;
  if (!loading && !user) {
    router.push({ pathname: '/accounts/login', query: { next: router.asPath } });
    return <Loading />;
  }

  return (
    <div className=" pb-[57px] md:pb-0">
      <Head>
        <title>{inboxTitle(modalOpen, selectedChat, selectedTab, t)}</title>
      </Head>
      <Header />
      <main className="max-w-4xl h-[calc(100vh-155px)] md:h-[calc(100vh-98px)] mx-auto my-4 bg-white border rounded-sm grid grid-cols-3 overflow-hidden">
        <div className={isMobile ? (selectedChat ? 'hidden' : 'col-span-3') : undefined}>
          <div className="py-4 px-5 flex justify-between font-semibold border-b">
            <span />
            <p>{user.username}</p>
            <PencilAltIcon className="w-6 cursor-pointer" onClick={() => setModalOpen(true)} />
          </div>
          <div className="py-2 h-[calc(100vh-202px)] sm:h-[calc(100vh-155px)] overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
            {chats.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="px-4">
                    <UserPlaceholder width={56} height={56} />
                  </div>
                ))}
              </div>
            ) : (
              chats?.map((chat) => (
                <ChatRoom
                  key={chat.chatId}
                  chat={chat}
                  currUserId={user.uid}
                  setSelectedChat={() => setSelectedChat(chat.chatId)}
                  active={selectedChat === chat.chatId}
                />
              ))
            )}
          </div>
        </div>
        {((isMobile && selectedChat) || !isMobile) && (
          <div className={`border-l ${isMobile ? 'col-span-3' : 'col-span-2'}`}>
            {!selectedChat ? (
              <NoChatSelected openModal={() => setModalOpen(true)} />
            ) : (
              <Chat
                user={user}
                chat={chats.filter((c) => c.chatId === selectedChat)[0]}
                closeChat={() => setSelectedChat(null)}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            )}
          </div>
        )}
      </main>

      <NewChat
        open={modalOpen}
        close={() => setModalOpen(false)}
        user={user}
        setSelectedChat={setSelectedChat}
      />
    </div>
  );
}
