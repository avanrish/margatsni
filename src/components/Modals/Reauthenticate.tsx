import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useState } from 'react';
import Modal from 'react-responsive-modal';
import { reAuthenticate } from '../../services/firebase';

export default function Reauthenticate({ open, close, email, handleChange }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation('settings');

  const handleSubmit = async () => {
    try {
      await reAuthenticate(email, password);
      await handleChange();
      close();
    } catch (err) {
      setError(err.code);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      center={true}
      classNames={{
        modal: 'flex flex-col w-full !max-w-xs rounded-lg !p-0 !text-center divide-y text-sm',
        modalContainer: 'overflow-y-hidden flex items-center justify-center',
      }}
    >
      <div className="p-4 !space-y-2">
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
          onClick={handleSubmit}
        >{t`submit`}</button>
      </div>
    </Modal>
  );
}
