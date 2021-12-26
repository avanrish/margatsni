import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Skeleton from 'react-loading-skeleton';

import { useAuth } from '../../hooks/useAuth';
import { getMyFollowings, getSuggestions } from '../../services/firebase';
import Suggestion from './Suggestion';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const getNewSuggestions = async () => {
      const following = await getMyFollowings(user.uid);
      const suggestions = await getSuggestions(user.uid, following);
      setSuggestions(suggestions);
      setLoading(false);
    };
    getNewSuggestions();
  }, [user.uid]);

  return (
    <div className="mt-4 ml-10 w-full">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="font-semibold text-gray-primary">{t('home:suggestions')}</h3>
        <button className="text-gray-600 font-semibold">{t('home:seeAll')}</button>
      </div>

      {!loading
        ? suggestions.map((profile) => (
            <Suggestion
              key={profile.id}
              id={profile.id}
              username={profile.username}
              fullName={profile.name}
              profileImg={profile.avatar}
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
