import { signOut } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useAuth } from '../../hooks/useAuth';
import { auth, db } from '../../lib/firebase';
import Link from '../Link';

export default function MiniProfile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName);
  const { t } = useTranslation();

  useEffect(() => {
    // For some reason sometimes firebase doesnt return displayName so I get it manually from users collection
    if (!displayName) {
      getDoc(doc(db, 'users', user.uid)).then((user) =>
        setDisplayName(`${user.data().username}+.${user.data().fullName}`)
      );
    }
  }, [displayName, user.uid]);

  return (
    <div className="flex items-center justify-between mt-14 ml-10 w-full">
      {user ? (
        <>
          <Link
            className="block relative rounded-full border p-[2px] w-16 h-16"
            href={`/${displayName?.split('+.')[0]}`}
          >
            <Image
              className="rounded-full"
              src={user?.photoURL || '/images/default.png'}
              alt={displayName?.split('+.')[0]}
              width={64}
              height={64}
            />
          </Link>
          <div className="flex-1 mx-4">
            <Link className="block font-bold" href={`/${displayName?.split('+.')[0]}`}>
              {displayName?.split('+.')[0]}
            </Link>
            <h3 className="text-sm text-gray-primary truncate">{displayName?.split('+.')[1]}</h3>
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
