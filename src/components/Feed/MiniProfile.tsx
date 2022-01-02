import { signOut } from '@firebase/auth';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

import { auth } from '../../lib/firebase';
import Link from '../Link';

export default function MiniProfile({ user }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mt-14 ml-10 w-full">
      <Link
        className="block relative rounded-full border p-[2px] w-16 h-16"
        href={`/${user.username}`}
      >
        <Image
          className="rounded-full"
          src={user?.profileImg || '/images/default.png'}
          alt={user.username}
          width={64}
          height={64}
        />
      </Link>
      <div className="flex-1 mx-4">
        <Link className="block font-bold" href={`/${user.username}`}>
          {user.username}
        </Link>
        <h3 className="text-sm text-gray-primary truncate">{user.fullName}</h3>
      </div>

      <button className="text-blue-primary text-xs font-semibold" onClick={() => signOut(auth)}>
        {t('common:signout')}
      </button>
    </div>
  );
}
