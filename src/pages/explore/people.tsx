import { EmojiSadIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Suggestion from '../../components/Feed/Suggestion';
import Header from '../../components/Header';
import LanguageSelect from '../../components/LanguageSelect';
import Loading from '../../components/Loading';
import { getSuggestions } from '../../services/firebase';
import { SuggestedUser } from '../../types';

export default function People() {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>(null);
  const { user, loading } = useRecoilValue(userState);
  const router = useRouter();
  const { t } = useTranslation('suggestions');

  useEffect(() => {
    if (!loading && user)
      getSuggestions([...user.following, user.uid], 15).then((docs) => setSuggestions(docs));
  }, [loading, user, router]);

  if (loading) return <Loading />;
  if (!loading && !user) {
    router.push({ pathname: '/accounts/login', query: { next: router.asPath } });
    return <Loading />;
  }

  return (
    <div>
      <Head>
        <title>Margatsni</title>
      </Head>

      <Header />
      <main className="flex flex-col max-w-lg mx-auto mt-7 pb-[57px] md:pb-0">
        <p className="font-semibold mb-2 ml-3">{t`suggestions`}</p>
        <div className="w-full bg-white rounded-md p-3 space-y-3">
          {suggestions === null ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center h-[40px]">
                <Skeleton width={40} height={40} borderRadius={999} />
                <div className="ml-4">
                  <Skeleton width={120} height={14} />
                  <Skeleton width={60} height={12} />
                </div>
              </div>
            ))
          ) : suggestions.length !== 0 ? (
            suggestions.map((profile) => (
              <Suggestion
                key={profile.uid}
                uid={profile.uid}
                username={profile.username}
                fullName={profile.fullName}
                profileImg={profile.profileImg}
                explore
              />
            ))
          ) : (
            <p className="text-center text-lg">
              <EmojiSadIcon className="w-32 mx-auto" />
              {t`noSuggestions`}
            </p>
          )}
        </div>
        <LanguageSelect />
      </main>
    </div>
  );
}
