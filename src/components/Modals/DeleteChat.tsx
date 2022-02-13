import useTranslation from 'next-translate/useTranslation';
import { useRecoilValue } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import { deleteUserFromChat } from '../../services/chats.firebase';
import CustomModal from '../CustomModal';

export default function DeleteChat({ open, close, chatId, participants }) {
  const { user } = useRecoilValue(userState);
  const { t } = useTranslation('inbox');

  const handleDelete = async () => {
    await deleteUserFromChat(chatId, participants, user.uid, user.fullName);
  };

  return (
    <CustomModal
      open={open}
      onClose={close}
      showCloseIcon={false}
      className="divide-y divide-gray-border"
    >
      <div className="p-5">
        <p className="text-lg font-semibold">{t`deleteTitle`}</p>
        <p className="text-gray-primary">{t`deleteDescription`}</p>
      </div>
      <div
        className="font-bold text-red-primary cursor-pointer py-3"
        onClick={handleDelete}
      >{t`delete`}</div>
      <div className="cursor-pointer py-3" onClick={close}>{t`common:cancel`}</div>
    </CustomModal>
  );
}
