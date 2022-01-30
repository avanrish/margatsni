import useTranslation from 'next-translate/useTranslation';

export default function Toast({ text }) {
  const { t } = useTranslation('settings');
  return <div className={`toast ${!!text && '!bottom-0'}`}>{text ? t(text) : null}</div>;
}
