import { useRouter } from 'next/router';
import { HomeIcon as HomeIconActive } from '@heroicons/react/solid';
import { HomeIcon as HomeIconInactive } from '@heroicons/react/outline';

export default function HomeIcon({ open }) {
  const { pathname } = useRouter();

  return pathname === '/' && !open ? (
    <HomeIconActive className="navBtn order-1" />
  ) : (
    <HomeIconInactive className="navBtn order-1" />
  );
}
