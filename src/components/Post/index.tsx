import { useState, useRef } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';

import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import PostOptionsModal from '../Modals/PostOptions';
import Buttons from './Buttons';
import Caption from './Caption';
import Comments from './Comments';
import InputBox from './InputBox';
import PostHeader from './PostHeader';
import RImage from './Image';

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
  getPosts,
}: IPost) {
  const { pathname } = useRouter();
  const homePage = pathname === '/';

  const [comments, setComments] = useState(homePage ? initComments.slice(0, 5) : initComments); // Displays only 5 latest messages
  const [likes, setLikes] = useState(initLikes);
  const [openOptions, setOpenOptions] = useState(false);
  const { lang } = useTranslation();
  const mobile = useRecoilValue(mobileDeviceState);
  const inputRef = useRef(null);

  return (
    <div
      className={`flex bg-white my-7 border rounded-sm ${
        homePage || mobile ? 'flex-col' : 'flex-row max-h-[815px]'
      }`}
    >
      {(mobile || homePage) && (
        <PostHeader userImg={userImg} username={username} setOpenOptions={setOpenOptions} />
      )}

      <RImage postId={postId} img={img} homePage={homePage} />

      <div className="flex flex-col sm:min-w-[360px]">
        {!homePage && !mobile && (
          <PostHeader
            userImg={userImg}
            username={username}
            setOpenOptions={setOpenOptions}
            postId={postId}
            userId={userId}
          />
        )}
        <Buttons
          postId={postId}
          setLikes={setLikes}
          likes={likes}
          inputRef={homePage ? null : inputRef}
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
              locale: locales[lang],
            })}
          </p>
          <InputBox
            postId={postId}
            setComments={setComments}
            homePage={homePage}
            inputRef={inputRef}
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

export interface IPost {
  postId: string;
  userId: string;
  username: string;
  userImg: string;
  img: string;
  caption: string;
  likes: string[];
  comments: {
    username: string;
    comment: string;
    profileImg: string;
  }[];
  timestamp: number;
  getPosts?: any;
}
