import { useRouter } from 'next/router';
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid';
import { ChatIcon, HeartIcon, PaperAirplaneIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import useTranslation from 'next-translate/useTranslation';

import { clipboardState } from '../../atoms/ClipboardAtom';
import { toggleLike } from '../../services/firebase';
import { SavePostIcon } from '../Icons';

export default function Buttons({ postId, setLikes, likes, inputRef, currUserId, setLoginDialog }) {
  const [hasLiked, setHasLiked] = useState(false);
  const setClipboard = useSetRecoilState(clipboardState);
  const router = useRouter();
  const { t } = useTranslation('post');

  useEffect(() => {
    setHasLiked(!!likes.find((like) => like === currUserId));
  }, [likes, currUserId]);

  const likePost = async () => {
    toggleLike(hasLiked, currUserId, postId, setLikes);
  };

  return (
    <div className={`flex flex-col ${inputRef && 'order-2 mt-auto'}`}>
      <div className="flex justify-between px-4 pt-4 border-t">
        <div className="flex space-x-4">
          {hasLiked ? (
            <HeartIconFilled onClick={likePost} className="btn text-red-500" />
          ) : (
            <HeartIcon
              onClick={currUserId ? likePost : () => setLoginDialog(true)}
              className="btn"
            />
          )}
          <ChatIcon
            className="btn"
            onClick={() => {
              if (!currUserId) setLoginDialog(true);
              else if (inputRef) inputRef.current.focus();
              else router.push(`/p/${postId}`);
            }}
          />
          <PaperAirplaneIcon
            className="btn"
            onClick={() => setClipboard({ monit: true, post: postId })}
          />
        </div>
        <SavePostIcon postId={postId} />
      </div>
      {likes.length > 0 && (
        <p className="font-semibold pt-3 pl-5 order-2">{t('likes', { count: likes.length })}</p>
      )}
    </div>
  );
}
