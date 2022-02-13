import { ChevronLeftIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';

import getOtherParticipants from '../../util/getOtherParticipants';
import { DetailsIcon } from '../Icons';
import ChatDetails from './ChatDetails';
import Messages from './Messages';
import SendMessage from './SendMessage';

export default function Chat({
  user,
  closeChat,
  chat: { participants, messages, chatId },
  selectedTab,
  setSelectedTab,
}) {
  const { t } = useTranslation('inbox');
  const otherParticipants = getOtherParticipants(participants, user.uid);

  return (
    <div>
      <div className="py-4 px-5 flex justify-between font-semibold border-b">
        <ChevronLeftIcon className="w-6 cursor-pointer" onClick={closeChat} />
        <p className="max-w-[180px] truncate">
          {selectedTab === 0
            ? Object.keys(otherParticipants)
                .map((p) => otherParticipants[p].fullName)
                .join(', ') || user.fullName
            : t`details`}
        </p>
        <DetailsIcon selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <div className="h-[calc(100vh-202px)] md+:h-[calc(100vh-155px)] flex flex-col">
        <div
          className={`max-h-full h-full overflow-y-auto scrollbar-thumb-black scrollbar-thin pt-5 ${
            selectedTab === 0 && 'px-5'
          }`}
        >
          {selectedTab === 0 && (
            <Messages messages={messages} participants={otherParticipants} currUserId={user.uid} />
          )}
          {selectedTab === 1 && (
            <ChatDetails
              otherParticipants={otherParticipants}
              chatId={chatId}
              participants={participants}
            />
          )}
        </div>
        {!selectedTab && (
          <div className="mt-auto">
            <SendMessage userId={user.uid} chatId={chatId} />
          </div>
        )}
      </div>
    </div>
  );
}
