import type { AppProps } from 'next/app';
import Router from 'next/router';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import ProgressBar from '@badrap/bar-of-progress';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-cookienotice/dist/index.css';
import 'react-responsive-modal/styles.css';

import '../../styles/globals.css';
import Wrapper from '../components/Wrapper';

const CookieNotice = dynamic(() => import('react-cookienotice'), { ssr: false });

const progress = new ProgressBar({ size: 4, className: 'progress-bar' });

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

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
