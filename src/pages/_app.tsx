import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

import { AuthProvider } from '../lib/authProvider';
import '../../styles/globals.css';
import 'react-cookienotice/dist/index.css';

const CookieNotice = dynamic(() => import('react-cookienotice'), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  return (
    <AuthProvider>
      <RecoilRoot>
        <div className="bg-[#FAFAFA] min-h-screen">
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
      <CookieNotice
        cookieTextLabel={t`common:cookie`}
        acceptButtonLabel={t`common:accept`}
        readMoreButtonLabel={t`common:readMore`}
        readMoreButtonLink={t`common:readMoreLink`}
      />
    </AuthProvider>
  );
}
export default MyApp;
