import { EmojiHappyIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

import { sendMessage } from '../../services/firebase';
import Spinner from '../Spinner';

export default function SendMessage({ userId, chatId }) {
  const [message, setMessage] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const { t } = useTranslation('inbox');

  const disabled = message.trim() === '';

  const handleClick = async (e) => {
    e.preventDefault();
    setInProgress(true);
    await sendMessage(chatId, message, userId);
    setInProgress(false);
    setMessage('');
  };

  return (
    <form
      onSubmit={handleClick}
      className="m-4 flex items-center px-2 py-1 border border-gray-border rounded-full"
    >
      <EmojiHappyIcon className="h-7" />
      <input
        type="text"
        className="border-none flex-1 focus:ring-0"
        placeholder={t`inputPlaceholder`}
        value={message}
        onChange={({ target }) => setMessage(target.value)}
      />
      <button
        disabled={disabled}
        type="submit"
        className={`font-semibold text-blue-primary mr-2 ${
          disabled && 'opacity-50 cursor-default'
        }`}
      >
        {inProgress ? <Spinner blue /> : t`send`}
      </button>
    </form>
  );
}
