import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { userState } from '../atoms/UserAtom';
import { auth } from '../lib/firebase';
import { getUserDataByUserId } from '../services/firebase';

export default function Wrapper({ children }) {
  const setUser = useSetRecoilState(userState);

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
  return <div className="bg-[#FAFAFA] min-h-screen">{children}</div>;
}
