import Image from 'next/image';
import { useRef } from 'react';

import Link from '../Link';

export default function Messages({ messages, participants, currUserId }) {
  const messagesEndRef = useRef(null);

  messagesEndRef?.current?.scrollIntoView();

  return (
    <div className="max-h-full space-y-2">
      {messages.map((m, i) => {
        if (m.uid !== currUserId)
          return (
            <div key={i} className="flex items-center space-x-2">
              <Link href={`/${participants[m.uid].username}`}>
                <Image
                  className="border rounded-full"
                  src={participants[m.uid].profileImg}
                  alt={participants[m.uid].username}
                  width={24}
                  height={24}
                />
              </Link>
              <p className="chat-message">{m.message}</p>
            </div>
          );
        return (
          <div key={i} className="flex justify-end">
            <p className="chat-message bg-[#EFEFEF]">{m.message}</p>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
