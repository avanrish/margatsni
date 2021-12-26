import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Header from '../components/Header';

import Link from '../components/Link';

export default function P404() {
  const { t } = useTranslation('not-found');
  return (
    <div>
      <Head>
        <title>{t`notFound`} • Margatsni</title>
      </Head>
      <Header />

      <div className="max-w-max mx-auto text-center">
        <h2 className="my-6 font-semibold text-2xl">{t`sorry`}</h2>
        <div className="flex space-x-1">
          <p>{t`damagedLink`}</p>
          <Link href="/" className="text-blue-secondary">{t`backToIG`}</Link>
        </div>
      </div>
    </div>
  );
}
