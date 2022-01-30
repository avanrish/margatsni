import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

export default function SettingsTab({ titleCode, currentTab, setCurrentTab }) {
  const { t } = useTranslation('settings');

  const rootClass = classNames('border-l-2 py-3 px-6 cursor-pointer', {
    'border-black font-semibold': titleCode === currentTab,
    'border-transparent hover:border-gray-border hover:bg-gray-50': titleCode !== currentTab,
  });

  return (
    <div className={rootClass} onClick={() => setCurrentTab(titleCode)}>
      {t(titleCode)}
    </div>
  );
}
