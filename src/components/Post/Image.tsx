import NextImage from 'next/image';
import Link from '../Link';

export default function Image({ postId, img, homePage }) {
  const props: NextImageProps = {
    src: img || '/',
    alt: '',
    width: '100%',
    height: '100%',
    layout: 'responsive',
    objectFit: 'contain',
    placeholder: 'blur',
    blurDataURL: img,
    draggable: false,
  };

  return homePage ? (
    <Link href={`/p/${postId}`} className="block relative">
      <NextImage {...props} />
    </Link>
  ) : (
    <div className={`block relative w-full my-auto`}>
      <NextImage {...props} />
    </div>
  );
}

interface NextImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  layout: 'responsive' | 'fixed' | 'fill' | 'intrinsic';
  objectFit: 'contain' | 'cover' | 'fill';
  placeholder: 'blur' | 'empty';
  blurDataURL: string;
  draggable: boolean;
}
