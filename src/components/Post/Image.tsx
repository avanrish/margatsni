import NextImage from 'next/image';
import Link from '../Link';

export default function Image({ postId, img, homePage, loading }) {
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
    sizes: '(min-width: 800px) 50vw, 100vw',
    loading,
  };

  return homePage ? (
    <Link href={`/p/${postId}`} className="block relative w-full max-w-[790px]">
      <NextImage {...props} />
    </Link>
  ) : (
    <div className={`block relative w-full my-auto max-w-[790px]`}>
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
  sizes: string;
  loading: 'lazy' | 'eager';
}
