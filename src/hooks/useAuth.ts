import { useContext } from 'react';

import { AuthContext } from '../lib/authProvider';

export const useAuth = () => {
  return useContext(AuthContext);
};
