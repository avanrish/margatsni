import { useRouter } from 'next/router';
import { HomeIcon as Active } from '@heroicons/react/solid';
import { HomeIcon as Inactive } from '@heroicons/react/outline';

export default function HomeIcon({ open }) {
  const { pathname } = useRouter();

  return pathname === '/' && !open ? (
    <Active className="navBtn order-1" />
  ) : (
    <Inactive className="navBtn order-1" />
  );
}
