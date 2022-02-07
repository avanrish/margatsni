import { CheckIcon } from '@heroicons/react/outline';
import Image from 'next/image';

export default function SearchResults({ selected, setSelectedUsers, user }) {
  const toggleSelect = () => {
    if (selected) setSelectedUsers((prev) => prev.filter((u) => u.username !== user.username));
    else
      setSelectedUsers((prev) => [
        ...prev,
        {
          username: user.username,
          profileImg: user.profileImg,
          fullName: user.fullName,
          uid: user.uid,
        },
      ]);
  };

  return (
    <div
      className="flex pl-2 pr-4 py-2 items-center hover:bg-[#FAFAFA] cursor-pointer"
      onClick={toggleSelect}
    >
      <div className="relative w-[44px] h-[44px] aspect-square">
        <Image className="rounded-full" alt={user.username} src={user.profileImg} layout="fill" />
      </div>
      <div className="flex flex-col mx-4 items-start text-sm w-full truncate">
        <span className="font-semibold">{user.username}</span>
        <span className="text-gray-primary">{user.fullName}</span>
      </div>
      <div
        className={`w-[24px] h-[24px] rounded-full aspect-square flex items-center justify-center ${
          selected ? 'bg-blue-primary' : 'border border-black'
        }`}
      >
        <CheckIcon className="text-white w-5" />
      </div>
    </div>
  );
}
