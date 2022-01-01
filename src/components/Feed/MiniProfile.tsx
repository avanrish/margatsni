import { signOut } from '@firebase/auth';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { userState } from '../../atoms/UserAtom';
import { auth } from '../../lib/firebase';
import Link from '../Link';

export default function MiniProfile() {
  const { user } = useRecoilValue(userState);
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mt-14 ml-10 w-full">
      {user ? (
        <>
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
        </>
      ) : (
        <>
          <Skeleton count={1} borderRadius={999} width={64} height={64} />
          <div className="flex-1 mx-4">
            <Skeleton count={1} width={160} height={24} />
            <Skeleton count={1} width={160} height={20} />
          </div>
          <Skeleton count={1} width={46} height={16} />
        </>
      )}
    </div>
  );
}
