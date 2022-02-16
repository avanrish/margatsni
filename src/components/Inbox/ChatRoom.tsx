import Image from 'next/image';

export default function ChatRoom({ chat, currUserId, setSelectedChat, active }) {
  const { participants: allParticipants, messages } = chat;

  const otherParticipants = allParticipants.filter((p) => p.uid !== currUserId);
  const imgUrl =
    allParticipants.length > 2 ? '/images/default.png' : otherParticipants[0].profileImg;

  const lastMessage = messages.filter((m) => m.uid !== currUserId).reverse()[0];
  const title = otherParticipants
    .filter((p) => !p.left)
    .map((p) => p.fullName)
    .join(',');

  return (
    <div
      className={`flex items-center px-4 py-2 cursor-pointer ${
        active ? 'bg-[#EFEFEF]' : 'hover:bg-[#FAFAFA]'
      }`}
      onClick={setSelectedChat}
    >
      <Image className="rounded-full" src={imgUrl} alt="" width={56} height={56} />
      <div className="ml-4">
        <p className="max-w-[180px] truncate">
          {otherParticipants.length > 1
            ? messages[messages.length - 1]?.fullName || title || 'SYSTEM'
            : otherParticipants[0].fullName}
        </p>
        <p className="text-gray-primary truncate">{lastMessage?.message || ''}</p>
      </div>
    </div>
  );
}
