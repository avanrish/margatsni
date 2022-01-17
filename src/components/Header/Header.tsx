import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CameraIcon } from '@heroicons/react/outline';
import { useRecoilState, useRecoilValue } from 'recoil';

import Link from '../Link';
import CreatePost from '../Modals/CreatePost';
import Navigation from './Navigation';
import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import { userState } from '../../atoms/UserAtom';
import Search from './Search';

export default function Header({ resetPassword = false }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobile, setMobile] = useRecoilState(mobileDeviceState);
  const { user, loading } = useRecoilValue(userState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const windowResize = () => {
      if (window.innerWidth >= 800) setMobile(false);
      else setMobile(true);
    };

    windowResize();

    window.addEventListener('resize', windowResize);

    return () => window.removeEventListener('resize', windowResize);
  }, [setMobile]);

  return (
    <>
      <header className="bg-white h-[67px] shadow-sm border-b sticky top-0 z-40">
        {mobile === null || loading ? null : (
          <div className="flex justify-between h-full max-w-6xl mx-5 lg:mx-auto">
            {mobile && user && (
              <div className="flex items-center">
                <CameraIcon className="h-6 w-6" onClick={() => setOpen(true)} />
              </div>
            )}
            {/* Left  */}
            <div className="flex items-center lg:ml-5 xl:ml-0">
              <Link href="/" className="h-[29px]">
                <Image
                  src="/images/margatsni.png"
                  width={121}
                  height={35.46}
                  alt="Margatsni"
                  objectFit="contain"
                />
              </Link>
            </div>

            {!resetPassword && (
              <>
                {/* Middle - Search Input */}
                {!mobile && <Search setDropdownOpen={setDropdownOpen} />}

                {/* Right */}
                <Navigation
                  open={open}
                  setOpen={setOpen}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                />
              </>
            )}
          </div>
        )}
      </header>
      {user && <CreatePost open={open} setOpen={setOpen} />}
    </>
  );
}
