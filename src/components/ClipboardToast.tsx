import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { toastState } from '../atoms/ToastAtom';

export default function Toast() {
  const [{ active, action, post }, setToast] = useRecoilState(toastState);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (active && typeof window !== 'undefined') {
      if (action === 'clipboard')
        navigator.clipboard.writeText(`${window.location.origin}/p/${post}`);
      window.setTimeout(() => setToast({ active: false, post, action }), 2000);
    }
  }, [active, post, action, setToast]);

  return (
    <div className={`toast ${active && '!bottom-0'}`}>
      {action === 'clipboard' ? t`clipboard` : t(`settings:${action}`)}
    </div>
  );
}
