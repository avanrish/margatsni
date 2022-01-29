import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import Toast from './Toast';
import ChangePicture from './ChangePicture';
import deepEqual from '../../util/deepEqual';
import validData from '../../util/validData';
import { updateUserData } from '../../services/users.firebase';
import Spinner from '../Spinner';

export default function EditProfile({ user, loading, setUser }) {
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
    if (!loading) setNewUser(user);
  }, [loading, user]);

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

  if (loading)
    return (
      <div className="mx-8">
        <Skeleton height={300} />
      </div>
    );

  return (
    <div className="space-y-4">
      <ChangePicture
        profileImg={newUser?.profileImg || user?.profileImg}
        username={user?.username}
        userId={user?.uid}
        setActiveToast={setActiveToast}
      />

      {/* Full Name */}
      <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold self-start mt-2">{t`name`}</div>
        <div className="w-full max-w-xs flex flex-col space-y-3">
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
      <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold self-start mt-2">{t`username`}</div>
        <div className="w-full max-w-xs flex flex-col space-y-3">
          <input
            className={`rounded border-gray-border w-full ${true && 'disabled'}`}
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
      <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold">{t`website`}</div>
        <div className="w-full max-w-xs">
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
      <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold self-start">{t`bio`}</div>
        <div className="w-full max-w-xs">
          <textarea
            className="rounded border-gray-border w-full"
            value={newUser?.bio || ''}
            onChange={handleChange}
            name="bio"
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
