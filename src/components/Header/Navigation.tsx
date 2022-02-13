import { HeartIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import useTranslation from 'next-translate/useTranslation';

import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import { userState } from '../../atoms/UserAtom';
import { CreateIcon, ExploreIcon, HomeIcon, MailIcon } from '../Icons';
import Link from '../Link';
import Dropdown from '../Dropdown';

export default function Navigation({ open, setOpen, dropdownOpen, setDropdownOpen }) {
  const mobile = useRecoilValue(mobileDeviceState);
  const { user } = useRecoilValue(userState);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
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
              <CreateIcon open={open} setOpen={setOpen} mobile={mobile} />
              <ExploreIcon active={router.pathname === '/explore'} mobile={mobile} />
              <HeartIcon className="navBtn order-4" />

              <div
                className={`relative h-10 w-10 order-5 z-10 rounded-full p-2 ${
                  dropdownOpen && 'border border-black'
                }`}
              >
                <Image
                  src={user?.profileImg || '/images/default.png'}
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
              href={{ pathname: '/accounts/login', query: { next: router.asPath } }}
              className="text-white font-semibold bg-blue-primary text-sm h-[30px] px-3 flex items-center rounded-md"
            >
              {t('common:login')}
            </Link>
            <Link
              href={{ pathname: '/accounts/signup', query: { next: router.asPath } }}
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
