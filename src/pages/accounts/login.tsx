import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Link from '../../components/Link';
import { loginUser } from '../../services/users.firebase';
import Spinner from '../../components/Spinner';
import Loading from '../../components/Loading';
import LanguageSelect from '../../components/LanguageSelect';

export default function LogIn() {
  const [credentials, setCredentials] = useState<ILogin>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading: authLoading } = useRecoilValue(userState);
  const { t } = useTranslation();

  if (authLoading) return <Loading />;
  if (user) {
    router.push('/');
    return null;
  }

  const isInvalid = credentials.email.trim() === '' || credentials.password.trim() === '';

  const handleChange = ({ target }) =>
    setCredentials((prev) => ({ ...prev, [target.name]: target.value }));

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(credentials);
      router.push('/');
    } catch (err) {
      setError(err.code);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Head>
        <title>{t('common:login')} • Margatsni</title>
      </Head>
      <main className="flex justify-center items-center">
        <span className="hidden md:inline-flex">
          <Image
            src="/images/iphone-with-profile.jpg"
            alt="Iphone with profile"
            width={454}
            height={618}
            draggable={false}
          />
        </span>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col w-screen pt-10 max-w-xs xs:max-w-sm xs:border xs:py-6 xs:px-10 xs:bg-white">
            <Image
              src="/images/margatsni.png"
              alt="Instagram"
              width={174}
              height={51}
              objectFit="contain"
              draggable={false}
            />
            <form className="flex flex-col space-y-2 mt-8" method="POST">
              <input
                className="input"
                type="text"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
              />
              <input
                className="input"
                type="password"
                name="password"
                placeholder={t('auth:password')}
                value={credentials.password}
                onChange={handleChange}
              />
              <button disabled={isInvalid || loading} className="login_btn" onClick={handleSubmit}>
                {loading ? <Spinner /> : t('common:login')}
              </button>
            </form>
            {error && (
              <div className="text-center text-red-500 text-sm mt-3">{t(`auth:${error}`)}</div>
            )}
            <div className="mt-3 flex border-b border-gray-border justify-center">
              <p className="translate-y-2 text-xs bg-white z-10 px-5 uppercase text-gray-primary select-none font-semibold">
                {t('auth:or')}
              </p>
            </div>
            <Link
              href="/accounts/password/reset"
              className="max-w-max mx-auto text-center text-xs mt-6 text-blue-secondary hover:text-blue-500"
            >
              {t('auth:forgot')}
            </Link>
          </div>
          <div className="flex justify-center w-full pt-10 max-w-xs xs:max-w-sm xs:border xs:py-6 xs:px-10 xs:bg-white text-sm space-x-1">
            <span>{t('common:noAccount')}</span>
            <Link href="/accounts/signup" className="text-blue-primary font-semibold">
              {t('common:signup')}
            </Link>
          </div>
        </div>
      </main>
      <LanguageSelect />
    </div>
  );
}

export interface ILogin {
  email: string;
  password: string;
}
