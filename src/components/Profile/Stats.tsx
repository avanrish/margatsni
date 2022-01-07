import useTranslation from 'next-translate/useTranslation';

export default function Stats({ profile }) {
  const { t } = useTranslation('common');
  return (
    <div className="xs:flex space-x-10 hidden">
      <div>
        <span className="font-semibold mr-1">{profile.posts.length}</span>
        {profile.posts.length === 1 ? t`postSingular` : t`posts`}
      </div>
      <div>
        <span className="font-semibold mr-1">{profile.followers.length}</span>
        {profile.followers.length === 1 ? t`follower` : t`followers`}
      </div>
      <div>
        <span className="font-semibold mr-1">{profile.following.length}</span>
        {t`profileFollowing`}
      </div>
    </div>
  );
}
