import { atom } from 'recoil';

export const userState = atom<{ user: any | null; loading: boolean }>({
  key: 'userState',
  default: {
    user: null,
    loading: true,
  },
});
