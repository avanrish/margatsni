import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import Toast from './Toast';
import ChangePicture from './ChangePicture';
import deepEqual from '../../util/deepEqual';
import validData from '../../util/validData';
import { updateUserData } from '../../services/firebase';
import Spinner from '../Spinner';

export default function EditProfile({ user, setUser }) {
  const [newUser, setNewUser] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [inactiveSubmit, setInactiveSubmit] = useState(true);
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (activeToast && typeof window !== 'undefined')
      window.setTimeout(() => setActiveToast(null), 2000);
  }, [activeToast]);

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

  const handleSubmit = async () => {
    const { valid, error } = validData(newUser);
    if (!valid) {
      setActiveToast(error);
      setNewUser(user);
    } else {
      setUpdateInProgress(true);
      await updateUserData(user.uid, newUser);
      setUser({ user: newUser });
      setUpdateInProgress(false);
      setActiveToast('profileSaved');
    }
  };

  return (
    <div className="space-y-4">
      <ChangePicture
        profileImg={newUser?.profileImg || user?.profileImg}
        username={user?.username}
        userId={user?.uid}
        setActiveToast={setActiveToast}
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
            className={`rounded border-gray-border w-full ${true && 'disabled-input'}`}
            type="text"
            placeholder={t`email`}
            defaultValue={newUser?.email || ''}
            disabled
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
          <button className="login_btn mt-4" disabled={inactiveSubmit} onClick={handleSubmit}>
            {updateInProgress ? <Spinner /> : t`submit`}
          </button>
        </div>
      </div>

      <Toast text={activeToast} />
    </div>
  );
}
