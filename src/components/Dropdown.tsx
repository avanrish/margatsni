import { signOut } from '@firebase/auth';
import { CogIcon, UserCircleIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';

import { auth } from '../lib/firebase';
import Link from './Link';

export default function Dropdown({ username }) {
  const { t } = useTranslation('common');
  return (
    <div className="absolute -left-28 top-12 w-40 rounded-md border bg-white z-10 flex flex-col select-none">
      <Link href={`/${username}`} className="flex items-center pl-3 hover:bg-gray-100 py-1">
        <UserCircleIcon className="w-5 h-5 mr-2" />
        {t`profile`}
      </Link>
      <Link href="/accounts/edit" className="flex items-center pl-3 hover:bg-gray-100 py-1">
        <CogIcon className="w-5 h-5 mr-2" />
        {t`settings`}
      </Link>
      <div
        className="border-t pl-3 hover:bg-gray-100 cursor-pointer py-1"
        onClick={() => signOut(auth)}
      >{t`signout`}</div>
    </div>
  );
}
