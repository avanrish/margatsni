import { HeartIcon, PlusCircleIcon as PlusCircleOutline } from '@heroicons/react/outline';
import { PlusCircleIcon as PlusCircleSolid } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useTranslation from 'next-translate/useTranslation';

import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import { userState } from '../../atoms/UserAtom';
import { MailIcon, HomeIcon } from '../Icons';
import Link from '../Link';
import Search from '../Search';
import CompassIcon from '../Icons/ExploreIcon';
import Dropdown from '../Dropdown';

export default function Navigation({ open, setOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mobile = useRecoilValue(mobileDeviceState);
  const { user } = useRecoilValue(userState);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      {/* Middle - Search input field */}
      {!mobile && <Search setDropdownOpen={setDropdownOpen} />}

      {/* Right */}
      <div className="flex items-center justify-end lg:mr-5 xl:mr-0">
        {user ? (
          <>
            {mobile && (
              <div className="flex items-center">
                <MailIcon />
              </div>
            )}
            <div
              className={`flex justify-between items-center space-x-4 ${mobile && 'nav_bottom'}`}
            >
              <Link href="/">
                <HomeIcon open={open} />
              </Link>
              {!mobile && <MailIcon />}
              {!open ? (
                <PlusCircleOutline
                  onClick={() => setOpen(true)}
                  className={`navBtn order-2 ${mobile && '!order-3'}`}
                />
              ) : (
                <PlusCircleSolid className={`navBtn order-2 ${mobile && '!order-3'}`} />
              )}
              <CompassIcon className={`navBtn order-3 ${mobile && '!order-2'}`} />
              <HeartIcon className="navBtn order-4" />

              <div
                className={`relative h-10 w-10 order-5 z-10 rounded-full p-2 ${
                  dropdownOpen && 'border border-black'
                }`}
              >
                <Image
                  src={user?.photoURL || '/images/default.png'}
                  alt="profile picture"
                  className="rounded-full cursor-pointer"
                  layout="fill"
                  onClick={() =>
                    mobile
                      ? router.push(`/${user.username}`)
                      : setDropdownOpen((prev: boolean) => !prev)
                  }
                />
                {!mobile && dropdownOpen && <Dropdown username={user.username} />}
              </div>
              {!mobile && dropdownOpen && (
                <div
                  className="w-screen h-screen fixed left-0 top-0 !m-0"
                  onClick={() => setDropdownOpen(false)}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              href="/accounts/login"
              className="text-white font-semibold bg-blue-primary text-sm h-[30px] px-3 flex items-center rounded-md"
            >
              {t('common:login')}
            </Link>
            <Link
              href="/accounts/signup"
              className="text-blue-primary font-semibold text-sm h-[30px] flex items-center rounded-md "
            >
              {t('common:signup')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
