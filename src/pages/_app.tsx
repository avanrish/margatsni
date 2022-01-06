import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import NextNProgress from 'nextjs-progressbar';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-cookienotice/dist/index.css';
import 'react-responsive-modal/styles.css';

import '../../styles/globals.css';
import Wrapper from '../components/Wrapper';

const CookieNotice = dynamic(() => import('react-cookienotice'), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  return (
    <>
      <NextNProgress height={5} color="#0095F6" options={{ showSpinner: false }} />
      <RecoilRoot>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </RecoilRoot>
      <CookieNotice
        cookieTextLabel={t`common:cookie`}
        acceptButtonLabel={t`common:accept`}
        readMoreButtonLabel={t`common:readMore`}
        readMoreButtonLink={t`common:readMoreLink`}
      />
    </>
  );
}
export default MyApp;
