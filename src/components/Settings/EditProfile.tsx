import Skeleton from 'react-loading-skeleton';
import ChangePicture from './ChangePicture';

export default function EditProfile({ user, loading }) {
  if (loading)
    return (
      <div className="mx-8">
        <Skeleton height={300} />
      </div>
    );

  return (
    <div className="space-y-4">
      <ChangePicture profileImg={user.profileImg} username={user.username} userId={user.uid} />
      {/* <div className="flex items-center">
        <div className="w-32 mx-8 text-right font-semibold">Imię i nazwisko</div>
        <input
          className="rounded border-gray-border w-full max-w-xs"
          type="text"
          defaultValue={user?.fullName}
        />
      </div> */}
    </div>
  );
}
