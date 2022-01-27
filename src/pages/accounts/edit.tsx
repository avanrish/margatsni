import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import tabs from '../../util/settingsTabs.json';
import SettingsTab from '../../components/Settings/SettingsTab';
import Header from '../../components/Header';
import LanguageSelect from '../../components/LanguageSelect';
import EditProfile from '../../components/Settings/EditProfile';

export default function Settings() {
  const { user, loading } = useRecoilValue(userState);
  const [currentTab, setCurrentTab] = useState('editProfile');
  const router = useRouter();
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (!loading && !user) router.push('/accounts/login');
  }, [loading, user, router]);

  return (
    <div>
      <Head>
        <title>{t(currentTab)} • Margatsni</title>
      </Head>
      <Header />
      <main className="flex flex-col max-w-4xl mx-auto mt-7 pb-[57px] md:pb-0">
        <div className="bg-white w-full border border-gray-border rounded-md flex divide-x divide-gray-border overflow-hidden">
          <div className="w-[235px]">
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
            {currentTab === 'editProfile' && <EditProfile user={user} loading={loading} />}
          </div>
        </div>
        <LanguageSelect />
      </main>
    </div>
  );
}
