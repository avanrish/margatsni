import Image from 'next/image';

import Link from '../Link';

export default function Comments({ comments, homePage, mobile }) {
  return (
    <div
      className={`ml-5 max-h-16 overflow-y-scroll overflow-x-hidden break-all scrollbar-thumb-black scrollbar-thin ${
        mobile ? 'max-h-52' : !homePage && '!max-h-full'
      }`}
    >
      {comments.map((comment, i) => (
        <div
          key={i}
          className={`flex items-center mb-3 flex-wrap space-x-2 ${
            !homePage && 'max-w-full md+:max-w-[360px]'
          }`}
        >
          {!homePage && (
            <Link className="block relative h-7 w-7" href={`/${comment.username}`}>
              <Image
                src={comment.profileImg}
                alt={comment.username}
                layout="fill"
                className="rounded-full"
              />
            </Link>
          )}

          <p>
            <Link className="font-semibold hover:underline" href={`/${comment.username}`}>
              {comment.username}
            </Link>
          </p>
          <span className="text-gray-600 inline break-all pr-2">{comment.comment}</span>
        </div>
      ))}
    </div>
  );
}
