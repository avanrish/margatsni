import { useRouter } from 'next/router';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { BookmarkIcon, ChatIcon, HeartIcon, PaperAirplaneIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, doc, updateDoc } from '@firebase/firestore';
import { useSetRecoilState } from 'recoil';

import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { clipboardState } from '../../atoms/ClipboardAtom';
import useTranslation from 'next-translate/useTranslation';

export default function Buttons({ postId, setLikes, likes, inputRef }) {
  const [hasLiked, setHasLiked] = useState(false);
  const setClipboard = useSetRecoilState(clipboardState);
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    setHasLiked(!!likes.find((like) => like === user?.uid));
  }, [likes, user?.uid]);

  const likePost = async () => {
    const docRef = doc(db, 'posts', postId);

    if (hasLiked) {
      setLikes(likes.filter((like) => like !== user.uid));
      updateDoc(docRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      setLikes((prevLikes) => [...prevLikes, user.uid]);
      updateDoc(docRef, {
        likes: arrayUnion(user.uid),
      });
    }
  };

  return (
    <div className={`flex flex-col ${inputRef && 'order-2 mt-auto'}`}>
      <div className="flex justify-between px-4 pt-4 border-t">
        <div className="flex space-x-4">
          {hasLiked ? (
            <HeartIconFilled onClick={likePost} className="btn text-red-500" />
          ) : (
            <HeartIcon onClick={likePost} className="btn" />
          )}
          <ChatIcon
            className="btn"
            onClick={inputRef ? () => inputRef.current.focus() : () => router.push(`/p/${postId}`)}
          />
          <PaperAirplaneIcon
            className="btn"
            onClick={() => setClipboard({ monit: true, post: postId })}
          />
        </div>
        <BookmarkIcon className="btn" />
      </div>
      {likes.length > 0 && (
        <p className="font-semibold pt-3 pl-5 order-2">
          {t('common:likes', { count: likes.length })}
        </p>
      )}
    </div>
  );
}
