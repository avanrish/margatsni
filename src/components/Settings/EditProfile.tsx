import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import ChangePicture from './ChangePicture';
import deepEqual from '../../util/deepEqual';
import validData from '../../util/validData';
import { changeEmail, updateUserData, updateChatParticipants } from '../../services/firebase';
import Spinner from '../Spinner';
import Reauthenticate from '../Modals/Reauthenticate';
import { toastState } from '../../atoms/ToastAtom';

export default function EditProfile({ user, setUser }) {
  const [newUser, setNewUser] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [openReauth, setOpenReauth] = useState(false);
  const [inactiveSubmit, setInactiveSubmit] = useState(true);
  const setToast = useSetRecoilState(toastState);
  const { t } = useTranslation('settings');

  useEffect(() => {
    setNewUser(user);
  }, [user]);

  useEffect(() => {
    if (newUser) {
      const equal = deepEqual(user, newUser);
      setInactiveSubmit(equal);
    }
  }, [newUser, user]);

  const handleChange = ({ target }) =>
    setNewUser((prev) => ({ ...prev, [target.name]: target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, error } = validData(newUser);
    if (!valid) {
      setToast((prev) => ({ ...prev, active: true, action: error }));
      setNewUser(user);
    } else {
      setUpdateInProgress(true);

      try {
        if (newUser.email !== user.email) await changeEmail(newUser.email);
        if (newUser.fullName !== user.fullName) updateChatParticipants(user, newUser.fullName);
        await updateUserData(user.uid, newUser);
        setUser({ user: newUser });
        setUpdateInProgress(false);
        setToast((prev) => ({ ...prev, active: true, action: 'profileSaved' }));
      } catch {
        setUpdateInProgress(false);
        setOpenReauth(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ChangePicture
        profileImg={newUser?.profileImg || user?.profileImg}
        username={user?.username}
        userId={user?.uid}
        setToast={setToast}
      />

      {/* Full Name */}
      <div className="edit-container">
        <div className="edit-label ">{t`name`}</div>
        <div className="edit-input flex flex-col space-y-3">
          <input
            className="rounded border-gray-border w-full"
            type="text"
            placeholder={t`name`}
            name="fullName"
            value={newUser?.fullName || ''}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-primary">{t`nameDescription`}</p>
        </div>
      </div>

      {/* Username */}
      <div className="edit-container">
        <div className="edit-label ">{t`username`}</div>
        <div className="edit-input flex flex-col space-y-3">
          <input
            className={`rounded border-gray-border w-full ${true && 'disabled-input'}`}
            type="text"
            placeholder={t`username`}
            disabled
            defaultValue={user?.username}
          />
          <p className="text-xs text-gray-primary">
            {t('usernameDescription', { username: user?.username })}
          </p>
        </div>
      </div>

      {/* Website */}
      <div className="edit-container">
        <div className="edit-label">{t`website`}</div>
        <div className="edit-input">
          <input
            className="rounded border-gray-border w-full"
            type="text"
            placeholder={t`website`}
            value={newUser?.website || ''}
            name="website"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="edit-container">
        <div className="edit-label">{t`bio`}</div>
        <div className="edit-input">
          <textarea
            className="rounded border-gray-border w-full"
            value={newUser?.bio || ''}
            onChange={handleChange}
            name="bio"
          />
          <p className="mt-6 text-sm font-semibold text-gray-primary">{t`personalInfo`}</p>
          <p className="text-xs text-gray-primary">{t`infoDescription`}</p>
        </div>
      </div>

      {/* Email */}
      <div className="edit-container">
        <div className="edit-label md:self-end mb-2">{t`email`}</div>
        <div className="edit-input">
          <input
            className={`rounded border-gray-border w-full`}
            type="text"
            name="email"
            placeholder={t`email`}
            value={newUser?.email || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="edit-container">
        <div className="edit-label">{t`phoneNumber`}</div>
        <div className="edit-input">
          <input
            className="rounded border-gray-border w-full"
            type="text"
            placeholder={t`phoneNumber`}
            value={newUser?.phoneNumber || ''}
            name="phoneNumber"
            onChange={handleChange}
          />
          <button className="login_btn mt-4" disabled={inactiveSubmit}>
            {updateInProgress ? <Spinner /> : t`submit`}
          </button>
        </div>
      </div>
      <Reauthenticate
        open={openReauth}
        close={() => setOpenReauth(false)}
        email={user.email}
        handleChange={handleSubmit}
      />
    </form>
  );
}
