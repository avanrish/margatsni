import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { getSuggestions } from '../../services/firebase';
import Suggestion from './Suggestion';
import Link from '../Link';
import UserPlaceholder from '../UserPlaceholder';

export default function Suggestions({ user }) {
  const [suggestions, setSuggestions] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('suggestions');

  useEffect(() => {
    const getNewSuggestions = async () => {
      const suggestions = await getSuggestions([...user.following, user.uid], 5);
      setSuggestions(suggestions);
      setLoading(false);
    };
    getNewSuggestions();
  }, [user]);

  return (
    <div className="mt-4 ml-10 w-full">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="font-semibold text-gray-primary">{t('suggestions')}</h3>
        <Link href="/explore/people">
          <button className="text-gray-600 font-semibold">{t('seeAll')}</button>
        </Link>
      </div>
      <div className="space-y-3">
        {!loading
          ? suggestions.map((profile) => (
              <Suggestion
                key={profile.data().uid}
                uid={profile.data().uid}
                username={profile.data().username}
                profileImg={profile.data().profileImg}
              />
            ))
          : [...Array(5)].map((_, i) => <UserPlaceholder key={i} />)}
      </div>
    </div>
  );
}
