import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import Link from '../../components/Link';
import { createUser, doesUsernameExist } from '../../services/firebase';
import Spinner from '../../components/Spinner';
import Loading from '../../components/Loading';
import LanguageSelect from '../../components/LanguageSelect';

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<ICredentials>({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const { user, loading: authLoading } = useRecoilValue(userState);
  const { t } = useTranslation();

  if (authLoading) return <Loading />;
  if (user) {
    const { next } = router.query;
    router.replace((next as string) || '/');
    return <Loading />;
  }

  const isInvalid =
    credentials.username.trim() === '' ||
    credentials.email.trim() === '' ||
    credentials.fullName.trim() === '' ||
    credentials.password.trim() === '';

  const register = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (credentials.fullName.trim() === '') throw { code: 'auth/invalid-fullname' };
      await doesUsernameExist(credentials.username);
      await createUser(credentials);
    } catch (err) {
      setError(err.code);
      setLoading(false);
    }
  };

  const handleChange = ({ target }) =>
    setCredentials((prev) => ({ ...prev, [target.name]: target.value }));

  return (
    <div className="flex flex-col xs:pt-10">
      <Head>
        <title>{t('common:signup')} • Margatsni</title>
      </Head>
      <main className="flex flex-col space-y-4 justify-center items-center">
        <div className="flex flex-col w-full pt-10 max-w-xs xs:max-w-sm xs:border xs:py-6 xs:px-10 xs:bg-white">
          <Image
            src="/images/margatsni.png"
            alt="Instagram"
            width={174}
            height={51}
            objectFit="contain"
            draggable={false}
          />
          <p className="mb-4 text-center font-semibold text-gray-primary">
            {t('signup:signUpMsg')}
          </p>
          <form className="flex flex-col space-y-2" method="POST">
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Email"
              className="input"
            />
            <input
              type="text"
              name="fullName"
              value={credentials.fullName}
              onChange={handleChange}
              placeholder={t('signup:fullName')}
              className="input"
            />
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder={t('signup:username')}
              className="input"
            />
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder={t('auth:password')}
              className="input"
            />
            <button disabled={isInvalid || loading} className="login_btn" onClick={register}>
              {loading ? <Spinner /> : t('common:signup')}
            </button>
          </form>
          {error && (
            <div className="text-center text-red-500 text-sm mt-3">{t(`auth:${error}`)}</div>
          )}
          <p className="mt-3 text-xs text-center text-gray-primary">{t('signup:cloneMsg')}</p>
        </div>

        <div className="flex justify-center w-full pt-10 max-w-xs xs:max-w-sm xs:border xs:py-6 xs:px-10 xs:bg-white text-sm space-x-1">
          <span>{t('signup:haveAccount')} </span>
          <Link href="/accounts/login" className="text-blue-primary font-semibold">
            {t('common:login')}
          </Link>
        </div>
      </main>
      <LanguageSelect />
    </div>
  );
}

export interface ICredentials {
  username: string;
  fullName: string;
  email: string;
  password: string;
}
