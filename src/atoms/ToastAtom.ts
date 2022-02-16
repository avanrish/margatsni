import { atom } from 'recoil';

export const toastState = atom({
  key: 'toastState',
  default: {
    active: false,
    post: '',
    action: 'clipboard',
  },
});
