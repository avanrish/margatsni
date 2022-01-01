import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';

import '../../styles/globals.css';
import Wrapper from '../components/Wrapper';

import 'react-cookienotice/dist/index.css';
const CookieNotice = dynamic(() => import('react-cookienotice'), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  return (
    <>
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
