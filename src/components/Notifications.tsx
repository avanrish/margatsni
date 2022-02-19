import { HeartIcon as Active } from '@heroicons/react/solid';
import { HeartIcon as Inactive } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import { getNotifications } from '../services/firebase';
import { userState } from '../atoms/UserAtom';
import { mobileDeviceState } from '../atoms/MobileDeviceAtom';
import Notification from './Notification';
import { Notification as TNotification } from '../types';

export default function Notifications() {
  const [active, setActive] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const { user } = useRecoilValue(userState);
  const isMobile = useRecoilValue(mobileDeviceState);
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => getNotifications(user?.uid, setNotifications), [user?.uid]);

  useEffect(() => {
    if (active && isMobile) setActive(false);
  }, [active, isMobile]);

  return (
    <>
      <div className="order-4 relative z-30">
        {notifications.length > 0 && (
          <span className="absolute -bottom-1 left-[10px] w-1 h-1 bg-red-primary rounded-full" />
        )}
        {active ? (
          <>
            <Active className="navBtn" onClick={() => setActive(false)} />
            <div className="absolute -right-5 w-[360px] mt-3.5 border rounded-md bg-white">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                  <Image src="/images/heart.png" alt="" width={48} height={48} />
                  <p className="text-lg">{t`noNotifications`}</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((n) => (
                    <Notification
                      key={n.docId}
                      username={n.senderUsername}
                      profileImg={n.senderProfileImg}
                      type={n.type}
                      docId={n.docId}
                      postId={n.postId}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : isMobile && router.pathname === '/accounts/activity' ? (
          <Active className="navBtn" />
        ) : (
          <Inactive
            className="navBtn"
            onClick={isMobile ? () => router.push('/accounts/activity') : () => setActive(true)}
          />
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
