import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../../atoms/UserAtom';
import Header from '../../../components/Header';
import LanguageSelect from '../../../components/LanguageSelect';
import Link from '../../../components/Link';
import Loading from '../../../components/Loading';
import { resetPassword } from '../../../services/firebase';

export default function ResetPassword() {
  const [email, setEmail] = useState<string>('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useRecoilValue(userState);
  const { t } = useTranslation();

  if (loading) return <Loading />;
  if (user) {
    router.push('/');
    return null;
  }

  const isInvalid = email.trim() === '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.code);
    }
  };

  return (
    <div className="flex flex-col">
      <Head>
        <title>{t('auth:reset')} • Margatsni</title>
      </Head>
      <Header resetPassword />
      <div className="mx-auto mt-32 w-screen max-w-xs xs:max-w-sm flex flex-col">
        <div className="flex flex-col pt-10 xs:border xs:py-10 xs:px-10 xs:bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-24 text-[#262626] border-2 border-[#262626] rounded-full p-3 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
          <p className="text-center font-semibold my-2">{t('auth:trouble')}</p>
          <p className="text-center text-gray-primary text-sm">{t('auth:resetMsg')}</p>
          <form method="POST">
            <input
              className="input mt-3 mb-1 w-full"
              type="text"
              placeholder="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <button disabled={isInvalid} className="login_btn w-full" onClick={handleSubmit}>
              {t('auth:loginLink')}
            </button>
          </form>
          {error && (
            <div className="text-center text-red-500 text-sm mt-3">{t(`auth:${error}`)}</div>
          )}
          {sent && (
            <div className="text-sm mt-2 text-center text-blue-light">{t('auth:emailSent')}</div>
          )}
          <div className="mt-3 flex border-b border-gray-300 justify-center">
            <p className="translate-y-2 text-xs bg-white z-10 px-5 uppercase text-gray-primary select-none font-semibold">
              {t('common:or')}
            </p>
          </div>
          <Link className="font-semibold text-sm text-center mt-4" href="/accounts/signup">
            {t('auth:newAccount')}
          </Link>
        </div>
        <Link
          href="/accounts/login"
          className="bg-white mt-4 xs:mt-0 xs:bg-transparent border py-4 text-center font-semibold text-sm"
        >
          {t('auth:backToLogin')}
        </Link>
      </div>
      <LanguageSelect />
    </div>
  );
}
