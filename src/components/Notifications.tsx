import { HeartIcon as Active } from '@heroicons/react/solid';
import { HeartIcon as Inactive } from '@heroicons/react/outline';
import { useState } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

export default function Notifications() {
  const [active, setActive] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      <div className="order-4 relative z-30">
        {active ? (
          <>
            <Active className="navBtn" onClick={() => setActive(false)} />
            <div className="absolute -right-5 w-[288px] mt-3.5 border rounded-md bg-white">
              <div className="flex flex-col items-center justify-center p-4 space-y-2">
                <Image src="/images/heart.png" alt="" width={48} height={48} />
                <p className="text-lg">{t`noNotifications`}</p>
              </div>
            </div>
          </>
        ) : (
          // TODO: GO TO /accounts/activity
          <Inactive className="navBtn" onClick={() => setActive(true)} />
        )}
      </div>
      {active && (
        <div
          className="fixed z-20 -left-4 top-0 w-screen h-screen"
          onClick={() => setActive(false)}
        />
      )}
    </>
  );
}
