import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { toastState } from '../../atoms/ToastAtom';
import { changePassword } from '../../services/firebase';
import Link from '../Link';
import Reauthenticate from '../Modals/Reauthenticate';
import Spinner from '../Spinner';

export default function ChangePassword({ user }) {
  const [password, setPassword] = useState({ newPasswd: '', confirmNewPasswd: '' });
  const [openReauth, setOpenReauth] = useState(false);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const setToast = useSetRecoilState(toastState);
  const { t } = useTranslation('settings');

  const isJohnDoe = user.username === 'johndoe33';

  const isInvalid =
    password.newPasswd !== password.confirmNewPasswd ||
    password.newPasswd.trim() === '' ||
    password.newPasswd.length < 6;

  const handleChange = ({ target }) =>
    setPassword((prev) => ({ ...prev, [target.name]: target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isJohnDoe) return;
    try {
      setUpdateInProgress(true);
      await changePassword(password.newPasswd);
      setToast((prev) => ({ ...prev, active: true, action: 'passwdChanged' }));
      setPassword({ newPasswd: '', confirmNewPasswd: '' });
      setUpdateInProgress(false);
    } catch {
      setUpdateInProgress(false);
      setOpenReauth(true);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex md:items-center">
          <div className="md:w-32 mx-8 font-semibold flex items-center justify-end">
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

        {isJohnDoe && (
          <div className="edit-container">
            <div className="edit-label" />
            <div className="edit-input text-xs -mt-3 -mb-3 text-gray-primary">
              <Trans
                i18nKey="settings:john"
                components={[<span key="john" className="font-semibold text-red-primary" />]}
              />
            </div>
          </div>
        )}

        <div className="edit-container">
          <div className="edit-label">{t`newPasswd`}</div>
          <div className="edit-input">
            <input
              className={`rounded border-gray-border w-full ${isJohnDoe && 'disabled-input'}`}
              type="password"
              name="newPasswd"
              value={password.newPasswd}
              onChange={handleChange}
              disabled={isJohnDoe}
            />
          </div>
        </div>

        <div className="edit-container">
          <div className="edit-label">{t`confirmNewPasswd`}</div>
          <div className="edit-input flex flex-col space-y-3">
            <input
              className={`rounded border-gray-border w-full ${isJohnDoe && 'disabled-input'}`}
              type="password"
              name="confirmNewPasswd"
              value={password.confirmNewPasswd}
              onChange={handleChange}
              disabled={isJohnDoe}
            />
            <button className="login_btn max-w-max" disabled={isInvalid || isJohnDoe}>
              {updateInProgress ? <Spinner /> : t`changePassword`}
            </button>
            <Link
              href="/accounts/password/reset"
              className="text-sm font-semibold text-blue-primary"
            >{t`auth:forgot`}</Link>
          </div>
        </div>
      </form>
      <Reauthenticate
        open={openReauth}
        close={() => setOpenReauth(false)}
        email={user.email}
        handleChange={handleSubmit}
      />
    </>
  );
}
