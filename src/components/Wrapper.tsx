import { onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { logInDialogState } from '../atoms/LogInDialogAtom';

import { userState } from '../atoms/UserAtom';
import { auth } from '../lib/firebase';
import { getUserDataByUserId } from '../services/firebase';

const LogInDialog = dynamic(() => import('../components/Modals/LogInDialog'), { ssr: false });

export default function Wrapper({ children }) {
  const setUser = useSetRecoilState(userState);
  const [open, setOpen] = useRecoilState(logInDialogState);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const data = await getUserDataByUserId(user.uid);
          setUser({ user: data, loading: false });
        } else setUser({ user: null, loading: false });
      }),
    [setUser]
  );
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {children}
      <LogInDialog open={open} close={() => setOpen(false)} />
    </div>
  );
}
