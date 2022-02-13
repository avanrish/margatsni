import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import tabs from '../../util/settingsTabs.json';
import SettingsTab from '../../components/Settings/SettingsTab';
import Header from '../../components/Header';
import LanguageSelect from '../../components/LanguageSelect';
import EditProfile from '../../components/Settings/EditProfile';
import ChangePassword from '../../components/Settings/ChangePassword';
import Loading from '../../components/Loading';
import Toast from '../../components/Settings/Toast';

export default function Settings() {
  const [{ user, loading }, setUser] = useRecoilState(userState);
  const [currentTab, setCurrentTab] = useState('editProfile');
  const [activeToast, setActiveToast] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (activeToast && typeof window !== 'undefined')
      window.setTimeout(() => setActiveToast(null), 2000);
  }, [activeToast]);

  if (loading) return <Loading />;
  if (!loading && !user) {
    router.push('/accounts/login');
    return <Loading />;
  }

  return (
    <div>
      <Head>
        <title>{t(currentTab)} • Margatsni</title>
      </Head>
      <Header />
      <main className="flex flex-col max-w-4xl mx-auto mt-7 pb-[57px] md:pb-0">
        <div className="bg-white w-full border border-gray-border rounded-md flex divide-x divide-gray-border overflow-hidden">
          <div className="w-[235px] hidden md:block">
            {tabs.map((tab) => (
              <SettingsTab
                key={tab}
                titleCode={tab}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            ))}
          </div>
          <div className="w-full py-6 space-y-4">
            {currentTab === 'editProfile' && (
              <EditProfile user={user} setUser={setUser} setActiveToast={setActiveToast} />
            )}
            {currentTab === 'changePassword' && (
              <ChangePassword user={user} setActiveToast={setActiveToast} />
            )}
          </div>
        </div>
        <Toast text={activeToast} />
        <LanguageSelect />
      </main>
    </div>
  );
}
