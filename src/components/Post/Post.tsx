import { useState, useRef } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import { userState } from '../../atoms/UserAtom';
import { logInDialogState } from '../../atoms/LogInDialogAtom';
import PostOptionsModal from '../Modals/PostOptions';
import Buttons from './Buttons';
import Caption from './Caption';
import Comments from './Comments';
import InputBox from './InputBox';
import PostHeader from './PostHeader';
import PostImage from './Image';
import { createNotification, deleteNotification } from '../../services/firebase';
import { Comment } from '../../types';

const locales = { en: enUS, pl };

export default function Post({
  postId,
  userId,
  username,
  userImg,
  img,
  caption,
  likes: initLikes,
  comments: initComments,
  timestamp,
  getPosts = null,
  loading,
}) {
  const { locale, pathname } = useRouter();
  const homePage = pathname === '/';

  const [comments, setComments] = useState<Comment[]>(
    homePage ? initComments.slice(0, 5) : initComments
  ); // Displays only 5 latest messages
  const [likes, setLikes] = useState<string[]>(initLikes);
  const [openOptions, setOpenOptions] = useState(false);
  const mobile = useRecoilValue(mobileDeviceState);
  const { user } = useRecoilValue(userState);
  const setLoginDialog = useSetRecoilState(logInDialogState);
  const inputRef = useRef(null);

  const handleNotification = (type, hasLiked = null) => {
    if (user.uid === userId) return;
    if (hasLiked) deleteNotification('like', user.username, postId);
    else
      createNotification(type, user.username, user.profileImg.match(/.*media/)[0], userId, postId);
  };

  return (
    <div
      className={`flex bg-white border rounded-sm ${
        homePage || mobile ? 'flex-col' : 'flex-row max-h-[815px]'
      }`}
    >
      {(mobile || homePage) && (
        <PostHeader
          userImg={userImg}
          username={username}
          setOpenOptions={setOpenOptions}
          setLoginDialog={setLoginDialog}
          currUser={user}
        />
      )}

      <PostImage postId={postId} img={img} homePage={homePage} loading={loading} />

      <div className="flex flex-col sm:min-w-[360px]">
        {!homePage && !mobile && (
          <PostHeader
            userImg={userImg}
            username={username}
            setOpenOptions={setOpenOptions}
            postId={postId}
            userId={userId}
            currUser={user}
            setLoginDialog={setLoginDialog}
          />
        )}
        <Buttons
          postId={postId}
          setLikes={setLikes}
          likes={likes}
          inputRef={homePage ? null : inputRef}
          currUserId={user?.uid}
          setLoginDialog={setLoginDialog}
          handleNotification={(hasLiked) => handleNotification('like', hasLiked)}
        />
        <Caption
          homePage={homePage}
          username={username}
          postId={postId}
          caption={caption}
          initComments={initComments}
          profileImg={userImg}
        />
        {comments.length > 0 && (
          <Comments homePage={homePage} comments={comments} mobile={mobile} />
        )}
        <div className="order-3">
          <p className="ml-5 text-xs uppercase text-gray-primary mt-2">
            {formatDistanceStrict(new Date(timestamp * 1000), new Date(), {
              addSuffix: true,
              locale: locales[locale],
            })}
          </p>
          <InputBox
            postId={postId}
            setComments={setComments}
            homePage={homePage}
            inputRef={inputRef}
            user={user}
            setLoginDialog={setLoginDialog}
            handleNotification={() => handleNotification('comment')}
          />

          <PostOptionsModal
            open={openOptions}
            setOpenOptions={setOpenOptions}
            postCreator={username}
            docId={postId}
            getPosts={getPosts}
          />
        </div>
      </div>
    </div>
  );
}
