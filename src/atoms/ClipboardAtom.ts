import { atom } from 'recoil';

export const clipboardState = atom({
  key: 'clipboardState',
  default: {
    monit: false,
    post: '',
  },
});
