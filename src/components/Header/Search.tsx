import { EmojiSadIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import useDebounce from '../../hooks/useDebounce';
import { getUsersByKeyword } from '../../services/users.firebase';
import Link from '../Link';

export default function Search({ setDropdownOpen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const { t } = useTranslation();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      getUsersByKeyword(debouncedSearchTerm)
        .then((docs) => setResult(docs))
        .catch(() => setResult(null));
    } else setResult(null);
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="hidden sm:inline-flex relative mt-1 p-3 rounded-md max-w-xs z-10">
        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="bg-gray-50 block pl-10 text-sm border-gray-300 rounded-md focus:ring-black focus:border-black"
          type="text"
          value={searchTerm}
          onChange={({ target }) => setSearchTerm(target.value)}
          onClick={() => setDropdownOpen(false)}
          placeholder={t('common:search')}
        />
        {searchTerm.trim() !== '' && (
          <>
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
              <XIcon className="h-4 w-4 cursor-pointer" onClick={() => setSearchTerm('')} />
            </div>
          </>
        )}
        {result && (
          <div className="absolute top-14 w-[288px] -ml-10 bg-white border py-2 rounded-md">
            {result.length > 0 ? (
              result.map((user) => (
                <Link
                  href={`/${user.data().username}`}
                  onClick={() => setSearchTerm('')}
                  key={user.data().uid}
                  className="flex items-center pl-3 py-2 hover:bg-gray-100"
                >
                  <div className="h-12 w-12 border-2 rounded-full border-red-500 p-[2px] cursor-pointer">
                    <Image
                      className="rounded-full"
                      src={user.data().profileImg}
                      alt={user.data().username}
                      width={54}
                      height={54}
                      objectFit="contain"
                    />
                  </div>
                  <div className="ml-3 flex flex-col text-sm">
                    <span className="font-semibold">{user.data().username}</span>
                    <span className="text-gray-primary">{user.data().fullName}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-2 flex flex-col items-center">
                <EmojiSadIcon className="w-14 h-14" />
                <span className="pt-4 pb-2 text-lg">{t`common:noResults`}</span>
              </div>
            )}
          </div>
        )}
      </div>
      {result && (
        <div
          className="fixed left-0 w-screen h-screen"
          onClick={() => (setSearchTerm(''), setResult(null))}
        />
      )}
    </>
  );
}
