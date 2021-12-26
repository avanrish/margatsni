import NextImage from 'next/image';
import Link from '../Link';

export default function Image({ postId, img, homePage }) {
  return homePage ? (
    <Link href={`/p/${postId}`} className="block relative">
      <NextImage
        src={img || '/'}
        alt=""
        width="100%"
        height="100%"
        layout="responsive"
        objectFit="contain"
        placeholder="blur"
        blurDataURL={img}
        draggable={false}
      />
    </Link>
  ) : (
    <div className={`block relative w-full my-auto`}>
      <NextImage
        src={img || '/'}
        alt=""
        width="100%"
        height="100%"
        layout="responsive"
        objectFit="contain"
        placeholder="blur"
        blurDataURL={img}
        draggable={false}
      />
    </div>
  );
}
