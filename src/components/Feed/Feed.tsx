import { useRecoilValue } from 'recoil';

import { mobileDeviceState } from '../../atoms/MobileDeviceAtom';
import { userState } from '../../atoms/UserAtom';
import MiniProfile from './MiniProfile';
import Posts from './Posts';
import Suggestions from './Suggestions';

export default function Feed() {
  const mobile = useRecoilValue(mobileDeviceState);
  const { user } = useRecoilValue(userState);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto">
      <section className="col-span-2">
        <Posts />
      </section>
      {!mobile && (
        <section className="hidden xl:inline-grid">
          <div className="fixed top-15">
            <MiniProfile user={user} />
            <Suggestions user={user} />
          </div>
        </section>
      )}
    </main>
  );
}
