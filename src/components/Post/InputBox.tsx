import { EmojiHappyIcon } from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

import { addComment } from '../../services/firebase';

export default function InputBox({
  setComments,
  postId,
  homePage,
  inputRef,
  user,
  setLoginDialog,
  handleNotification,
}) {
  const [comment, setComment] = useState('');
  const { t } = useTranslation('post');

  const sendComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!user) setLoginDialog(true);
    else {
      const commentToSend = comment;
      setComment('');

      await addComment(postId, commentToSend, user, setComments, homePage);
      handleNotification();
    }
  };

  return (
    <form onSubmit={sendComment} className="flex items-center px-4 py-2">
      <EmojiHappyIcon className="h-7" />
      <input
        type="text"
        className="border-none flex-1 focus:ring-0"
        value={comment}
        onChange={({ target }) => setComment(target.value)}
        placeholder={t('commentPlaceholder')}
        ref={inputRef}
      />
      <button
        type="submit"
        disabled={!comment.trim()}
        className={`font-semibold text-blue-400 ${!comment.trim() && 'opacity-50 cursor-default'}`}
      >
        {t('sendComment')}
      </button>
    </form>
  );
}
