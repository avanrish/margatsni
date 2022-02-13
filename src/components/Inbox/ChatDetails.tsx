import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useState } from 'react';

import Link from '../Link';
import DeleteChat from '../Modals/DeleteChat';

export default function ChatDetails({ otherParticipants, chatId, participants }) {
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation('inbox');
  return (
    <div>
      <div>
        <p className="font-semibold ml-5 mb-1">{t`members`}</p>
        <div>
          {participants.filter((p) => !p.left).length === 1 && (
            <p className="ml-5 text-sm text-gray-primary mb-2">{t`noParticipants`}</p>
          )}
          {Object.keys(otherParticipants).map((k) => {
            if (otherParticipants[k].left) return null;
            return (
              <Link
                key={otherParticipants[k].uid}
                href={`/${otherParticipants[k].username}`}
                className="flex items-center px-5 py-2 cursor-pointer hover:bg-[#FAFAFA]"
              >
                <Image
                  className="rounded-full"
                  src={otherParticipants[k].profileImg}
                  alt=""
                  width={56}
                  height={56}
                />
                <div className="ml-4">
                  <p className="font-semibold text-sm">{otherParticipants[k].username}</p>
                  <p className="text-gray-primary text-sm">{otherParticipants[k].fullName}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div
          className="border-y px-5 py-4 text-sm cursor-pointer text-red-primary"
          onClick={() => setOpenModal(true)}
        >{t`deleteChat`}</div>
      </div>
      <DeleteChat
        open={openModal}
        close={() => setOpenModal(false)}
        chatId={chatId}
        participants={participants}
      />
    </div>
  );
}
