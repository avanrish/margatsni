import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import useDebounce from '../../hooks/useDebounce';
import { createChat, createNotification, getUsersByKeyword } from '../../services/firebase';
import CustomModal from '../CustomModal';
import SearchResults from '../Inbox/SearchResults';
import Spinner from '../Spinner';

export default function NewMessage({ open, close, user, setSelectedChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const { t } = useTranslation('inbox');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      getUsersByKeyword(debouncedSearchTerm)
        .then((docs) => setResults(docs.filter((doc) => doc.uid !== user.uid)))
        .catch(() => setResults([]));
    } else setResults([]);
  }, [debouncedSearchTerm, user.uid]);

  const handleCreateChat = async () => {
    setInProgress(true);
    const newChat = await createChat([
      ...selectedUsers,
      {
        username: user.username,
        profileImg: user.profileImg.match(/.*media/)[0],
        fullName: user.fullName,
        uid: user.uid,
      },
    ]);
    selectedUsers.forEach((u) =>
      createNotification('newChat', user.username, user.profileImg, u.uid)
    );
    setInProgress(false);
    setSelectedChat(newChat.id);
    setSearchTerm('');
    setSelectedUsers([]);
    close();
  };

  return (
    <CustomModal open={open} onClose={close}>
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
        <button
          disabled={selectedUsers.length === 0}
          className="text-blue-primary font-semibold text-sm disabled:opacity-50"
          onClick={handleCreateChat}
        >
          {inProgress ? <Spinner blue /> : t`next`}
        </button>
      </div>
      <div className="text-base py-4">
        {results.length === 0 ? (
          <p className="ml-2 my-3.5 text-left text-sm text-gray-primary">{t`noResults`}</p>
        ) : (
          results.map((u) => (
            <SearchResults
              key={u.uid}
              selected={selectedUsers.findIndex((sel) => sel.username === u.username) !== -1}
              setSelectedUsers={setSelectedUsers}
              user={u}
            />
          ))
        )}
      </div>
    </CustomModal>
  );
}
