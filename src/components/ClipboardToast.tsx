import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { clipboardState } from '../atoms/ClipboardAtom';

export default function ClipboardMonit() {
  const [{ monit, post }, setClipboard] = useRecoilState(clipboardState);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (monit && typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/p/${post}`);
      window.setTimeout(() => setClipboard({ monit: false, post }), 2000);
    }
  }, [monit, post, setClipboard]);

  return <div className={`toast ${monit && '!bottom-0'}`}>{t`copiedToClipboard`}</div>;
}
