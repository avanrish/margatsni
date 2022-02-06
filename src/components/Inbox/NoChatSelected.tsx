import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

export default function NoChatSelected({ openModal }) {
  const { t } = useTranslation('inbox');
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image src="/images/inbox.png" alt="Inbox" width={96} height={96} objectFit="contain" />
      <span className="text-center space-y-1">
        <p className="text-2xl font-thin">{t`yourMessages`}</p>
        <p className="text-sm text-gray-primary">{t`description`}</p>
      </span>
      <button className="login_btn" onClick={openModal}>{t`sendMessage`}</button>
    </div>
  );
}
