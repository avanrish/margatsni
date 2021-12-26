import { useRouter } from 'next/router';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/solid';
import { HomeIcon as HomeIconOutline } from '@heroicons/react/outline';

export default function HomeIcon() {
  const { pathname } = useRouter();

  return pathname === '/' ? (
    <HomeIconSolid className="navBtn order-1" />
  ) : (
    <HomeIconOutline className="navBtn order-1" />
  );
}
