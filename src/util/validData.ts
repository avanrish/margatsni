export default function validData(newUser) {
  if (newUser.fullName.length < 3) return { valid: false, error: 'invalidName' };
  const regex =
    /(https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})/g;
  if (newUser?.website)
    if (!newUser.website.match(regex)) return { valid: false, error: 'invalidWebsite' };
  if (newUser?.bio?.length > 150) return { valid: false, error: 'invalidBio' };
  return { valid: true };
}
