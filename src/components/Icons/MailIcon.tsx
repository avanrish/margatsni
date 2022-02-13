import { PaperAirplaneIcon as Inactive } from '@heroicons/react/outline';
import { PaperAirplaneIcon as Active } from '@heroicons/react/solid';
import { useRouter } from 'next/router';

import Link from '../Link';

export default function MailIcon() {
  const { pathname } = useRouter();

  const active = pathname.split('/')[1] === 'direct' && pathname.split('/')[2] === 'inbox';

  return (
    <Link href="/direct/inbox" className="relative navBtn mb-2 order-2">
      {active ? <Active className="navBtn rotate-45" /> : <Inactive className="navBtn rotate-45" />}
    </Link>
  );
}
