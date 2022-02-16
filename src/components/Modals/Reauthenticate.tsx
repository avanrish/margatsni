import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useState } from 'react';

import { reAuthenticate } from '../../services/firebase';
import CustomModal from '../CustomModal';

export default function Reauthenticate({ open, close, email, handleChange }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation('settings');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reAuthenticate(email, password);
      await handleChange();
      close();
    } catch (err) {
      setError(err.code);
    }
  };

  return (
    <CustomModal open={open} onClose={close} center={true}>
      <form className="p-4 !space-y-2" onSubmit={handleSubmit}>
        <Image
          src={'/images/margatsni.png'}
          alt="Margatsni"
          width={174}
          height={51}
          objectFit="contain"
          draggable={false}
        />
        <p className="font-semibold">{t`reAuthDesc`}</p>
        <input
          type="password"
          placeholder="Password"
          className="input w-full"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        {error && <p className="text-red-500 text-sm">{t(`auth:${error}`)}</p>}
        <button
          disabled={password.length < 6 || password.trim() === ''}
          className="login_btn w-full"
        >{t`submit`}</button>
      </form>
    </CustomModal>
  );
}
