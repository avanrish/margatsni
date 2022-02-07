import { ChevronLeftIcon, EmojiHappyIcon, InformationCircleIcon } from '@heroicons/react/outline';

export default function Chat({ user, closeChat, chat }) {
  const otherParticipants = chat.participants.filter((p) => p.uid !== user.uid);

  return (
    <div>
      <div className="py-4 px-5 flex justify-between font-semibold border-b">
        <ChevronLeftIcon className="w-6 cursor-pointer" onClick={closeChat} />
        <p className="max-w-[180px] truncate">
          {otherParticipants.map((p) => p.fullName).join(', ')}
        </p>
        <InformationCircleIcon className="w-6 cursor-pointer" />
      </div>
      <div className="h-[calc(100vh-202px)] sm:h-[calc(100vh-155px)] flex flex-col">
        <div className="max-h-full h-full overflow-y-auto scrollbar-thumb-black scrollbar-thin"></div>
        <div className="mt-auto">
          <div className="m-4 flex items-center px-2 py-1 border border-gray-border rounded-full">
            <EmojiHappyIcon className="h-7" />
            <input
              type="text"
              className="border-none flex-1 focus:ring-0"
              placeholder="Message..."
            />
            <button
              type="submit"
              className={`font-semibold text-blue-400 mr-2 ${true && 'opacity-50 cursor-default'}`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
