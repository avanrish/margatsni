import Image from 'next/image';
import Link from '../Link';
import useTranslation from 'next-translate/useTranslation';

import CustomModal from '../CustomModal';

export default function LogInDialog({ open, close }) {
  const { t } = useTranslation();
  return (
    <CustomModal open={open} onClose={close} center={true}>
      <div className="p-8 !space-y-6">
        <Image
          src="/images/margatsni.png"
          alt="Margatsni"
          width={174}
          height={51}
          objectFit="contain"
          draggable={false}
        />
        <div>
          <Image src="/images/default.png" alt="User" width={100} height={100} />
        </div>
        <Link href="/accounts/login" className="login_btn">
          {t('common:login')}
        </Link>
        <p>
          {t`common:noAccount`}{' '}
          <Link
            href="/accounts/signup"
            className="text-blue-primary font-semibold"
          >{t`common:signup`}</Link>
        </p>
      </div>
    </CustomModal>
  );
}
