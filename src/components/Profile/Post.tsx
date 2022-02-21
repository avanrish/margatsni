import { ChatIcon, HeartIcon } from '@heroicons/react/solid';
import Image from 'next/image';

import Link from '../Link';

export default function Post({ post }) {
  return (
    <Link
      href={`/p/${post.docId}`}
      key={post.docId}
      className="relative aspect-square cursor-pointer"
    >
      <div className="z-10 absolute w-full h-full bg-black/30 flex items-center justify-center text-white space-x-6 opacity-0 hover:opacity-100 transition duration-300">
        <span className="flex items-center">
          <HeartIcon className="w-8 mr-1" />
          {post.likes.length}
        </span>
        <span className="flex items-center">
          <ChatIcon className="w-8 mr-1" />
          {post.comments.length}
        </span>
      </div>
      <Image
        draggable={false}
        src={post.image}
        alt=""
        layout="fill"
        objectFit="cover"
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
      />
    </Link>
  );
}
