import Trans from 'next-translate/Trans';

export default function Stats({ profile }) {
  return (
    <div className="xs:flex space-x-10 hidden">
      <div>
        <Trans
          i18nKey="profile:posts"
          values={{ count: profile.posts.length }}
          components={[<span key={0} className="font-semibold" />]}
        />
      </div>
      <div>
        <Trans
          i18nKey="profile:followers"
          values={{ count: profile.followers.length }}
          components={[<span key={1} className="font-semibold" />]}
        />
      </div>
      <div>
        <Trans
          i18nKey="profile:following"
          values={{ count: profile.following.length }}
          components={[<span key={2} className="font-semibold" />]}
        />
      </div>
    </div>
  );
}
