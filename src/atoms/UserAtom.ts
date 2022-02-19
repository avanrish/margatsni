import { atom } from 'recoil';
import { User } from '../types';

export const userState = atom<{ user: User | null; loading: boolean }>({
  key: 'userState',
  default: {
    user: null,
    loading: true,
  },
});
