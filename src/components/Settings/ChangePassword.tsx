import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { changePassword } from '../../services/firebase';
import Link from '../Link';
import Reauthenticate from '../Modals/Reauthenticate';
import Spinner from '../Spinner';
import Toast from './Toast';

export default function ChangePassword({ user }) {
  const [password, setPassword] = useState({ newPasswd: '', confirmNewPasswd: '' });
  const [activeToast, setActiveToast] = useState(null);
  const [openReauth, setOpenReauth] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const { t } = useTranslation('settings');

  const isInvalid =
    password.newPasswd !== password.confirmNewPasswd ||
    password.newPasswd.trim() === '' ||
    password.newPasswd.length < 6;

  const handleChange = ({ target }) =>
    setPassword((prev) => ({ ...prev, [target.name]: target.value }));

  const handleSubmit = async () => {
    try {
      setUpdateInProgress(true);
      await changePassword(password.newPasswd);
      setActiveToast('passwdChanged');
      setPassword({ newPasswd: '', confirmNewPasswd: '' });
      setUpdateInProgress(false);
    } catch {
      setUpdateInProgress(false);
      setOpenReauth(true);
    }
  };

  useEffect(() => {
    if (activeToast && typeof window !== 'undefined')
      window.setTimeout(() => setActiveToast(null), 2000);
  }, [activeToast]);

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="w-32 mx-8 font-semibold flex items-center justify-end">
          <Image
            className="rounded-full cursor-pointer"
            src={user.profileImg}
            alt=""
            width={38}
            height={38}
          />
        </div>
        <span className="text-2xl">{user.username}</span>
      </div>

      <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold">{t`newPasswd`}</div>
        <div className="w-full max-w-xs flex flex-col space-y-3">
          <input
            className="rounded border-gray-border w-full"
            type="password"
            name="newPasswd"
            value={password.newPasswd}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold self-start">{t`confirmNewPasswd`}</div>
        <div className="w-full max-w-xs flex flex-col space-y-3">
          <input
            className="rounded border-gray-border w-full"
            type="password"
            name="confirmNewPasswd"
            value={password.confirmNewPasswd}
            onChange={handleChange}
          />
          <button className="login_btn max-w-max" disabled={isInvalid} onClick={handleSubmit}>
            {updateInProgress ? <Spinner /> : t`changePassword`}
          </button>
          <Link
            href="/accounts/password/reset"
            className="text-sm font-semibold text-blue-primary"
          >{t`auth:forgot`}</Link>
        </div>
      </div>
      <Reauthenticate
        open={openReauth}
        close={() => setOpenReauth(false)}
        email={user.email}
        changePassword={handleSubmit}
      />
      <Toast text={activeToast} />
    </div>
  );
}
