import { ChevronLeftIcon, InformationCircleIcon } from '@heroicons/react/outline';

import getOtherParticipants from '../../util/getOtherParticipants';
import Messages from './Messages';
import SendMessage from './SendMessage';

export default function Chat({ user, closeChat, chat: { participants, messages, chatId } }) {
  const otherParticipants = getOtherParticipants(participants, user.uid);

  return (
    <div>
      <div className="py-4 px-5 flex justify-between font-semibold border-b">
        <ChevronLeftIcon className="w-6 cursor-pointer" onClick={closeChat} />
        <p className="max-w-[180px] truncate">
          {Object.keys(otherParticipants)
            .map((p) => otherParticipants[p].fullName)
            .join(', ') || user.fullName}
        </p>
        <InformationCircleIcon className="w-6 cursor-pointer" />
      </div>
      <div className="h-[calc(100vh-202px)] md+:h-[calc(100vh-155px)] flex flex-col">
        <div className="max-h-full h-full overflow-y-auto scrollbar-thumb-black scrollbar-thin pt-5 px-5">
          <Messages messages={messages} participants={otherParticipants} currUserId={user.uid} />
        </div>
        <div className="mt-auto">
          <SendMessage userId={user.uid} chatId={chatId} />
        </div>
      </div>
    </div>
  );
}
