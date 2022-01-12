import { ChatIcon, HeartIcon } from '@heroicons/react/solid';
import Image from 'next/image';

import Link from '../Link';

export default function Post({ post }) {
  return (
    <Link href={`/p/${post.id}`} key={post.id} className="relative aspect-square cursor-pointer">
      <div className="z-10 absolute w-full h-full bg-black/30 flex items-center justify-center text-white space-x-6 opacity-0 hover:opacity-100 transition duration-300">
        <span className="flex items-center">
          <HeartIcon className="w-8 mr-1" />
          {post.data().likes.length}
        </span>
        <span className="flex items-center">
          <ChatIcon className="w-8 mr-1" />
          {post.data().comments.length}
        </span>
      </div>
      <Image draggable={false} src={post.data().image} alt="" layout="fill" />
    </Link>
  );
}
