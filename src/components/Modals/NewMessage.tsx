import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import useDebounce from '../../hooks/useDebounce';
import { getUsersByKeyword } from '../../services/firebase';
import CustomModal from '../CustomModal';

export default function NewMessage({ open, onClose, userId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const { t } = useTranslation('inbox');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      getUsersByKeyword(debouncedSearchTerm)
        .then((docs) => setResults(docs.filter((doc) => doc.id !== userId)))
        .catch(() => setResults([]));
    } else setResults([]);
  }, [debouncedSearchTerm, userId]);

  return (
    <CustomModal open={open} onClose={onClose}>
      <p className="font-semibold py-3.5 text-base">{t`newMessage`}</p>
      <div className="flex items-center space-x-4 text-base pl-2 pr-4 py-2 font-semibold">
        <span>{t`to`}</span>
        <input
          className="border-none focus:ring-0 w-full"
          placeholder={`${t`common:search`}...`}
          type="text"
          value={searchTerm}
          onChange={({ target }) => setSearchTerm(target.value)}
        />
        <button disabled className="text-blue-primary font-semibold text-sm disabled:opacity-50">
          {t`next`}
        </button>
      </div>
      <div className="text-base">
        {results.length === 0 ? (
          <p className="ml-2 my-3.5 text-left text-sm text-gray-primary">{t`noResults`}</p>
        ) : null}
      </div>
    </CustomModal>
  );
}
