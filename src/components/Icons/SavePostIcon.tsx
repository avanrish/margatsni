import { BookmarkIcon as Active } from '@heroicons/react/solid';
import { BookmarkIcon as Inactive } from '@heroicons/react/outline';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { userState } from '../../atoms/UserAtom';
import { logInDialogState } from '../../atoms/LogInDialogAtom';
import { toggleSave } from '../../services/firebase';

export default function SavePostIcon({ postId }) {
  const [{ user, loading }, setUser] = useRecoilState(userState);
  const setLoginDialog = useSetRecoilState(logInDialogState);

  const saved = user?.saved?.filter((id: string) => id === postId).length > 0;

  const handleClick = () => toggleSave(user?.uid, postId, saved, saveCallback);

  function saveCallback() {
    let newUser = JSON.parse(JSON.stringify(user));
    if (saved) newUser.saved = newUser?.saved?.filter((id) => id !== postId);
    else newUser.saved = newUser.saved ? [...newUser.saved, postId] : [postId];
    setUser({ user: newUser, loading });
  }

  return saved ? (
    <Active className="btn" onClick={user ? handleClick : () => setLoginDialog(true)} />
  ) : (
    <Inactive className="btn" onClick={user ? handleClick : () => setLoginDialog(true)} />
  );
}
