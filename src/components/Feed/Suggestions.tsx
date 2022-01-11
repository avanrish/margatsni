import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Skeleton from 'react-loading-skeleton';

import { getSuggestions } from '../../services/users.firebase';
import Suggestion from './Suggestion';

export default function Suggestions({ user }) {
  const [suggestions, setSuggestions] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('suggestions');

  useEffect(() => {
    const getNewSuggestions = async () => {
      const suggestions = await getSuggestions([...user.following, user.uid]);
      setSuggestions(suggestions);
      setLoading(false);
    };
    getNewSuggestions();
  }, [user]);

  return (
    <div className="mt-4 ml-10 w-full">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="font-semibold text-gray-primary">{t('suggestions')}</h3>
        <button className="text-gray-600 font-semibold">{t('seeAll')}</button>
      </div>

      {!loading
        ? suggestions.map((profile) => (
            <Suggestion
              key={profile.data().uid}
              uid={profile.data().uid}
              username={profile.data().username}
              fullName={profile.data().name}
              profileImg={profile.data().profileImg}
            />
          ))
        : [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center mt-3 h-[40px]">
              <Skeleton width={40} height={40} borderRadius={999} />
              <div className="ml-4">
                <Skeleton width={120} height={14} />
                <Skeleton width={60} height={12} />
              </div>
            </div>
          ))}
    </div>
  );
}
