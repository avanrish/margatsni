import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from '@firebase/auth';

import { auth } from './firebase';

export const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        setUser(user);
        setLoading(false);
      }),
    []
  );

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
