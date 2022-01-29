import { parsePhoneNumberWithError } from 'libphonenumber-js';

export default function validData(newUser) {
  if (newUser.fullName.length < 3) return { valid: false, error: 'invalidName' };

  const regex =
    /(https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})/g;

  if (newUser?.website && !newUser?.website?.match(regex))
    return { valid: false, error: 'invalidWebsite' };

  if (newUser?.bio?.length > 150) return { valid: false, error: 'invalidBio' };

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!newUser.email.match(emailRegex)) return { valid: false, error: 'invalidEmail' };

  if (newUser?.phoneNumber) {
    try {
      parsePhoneNumberWithError(newUser?.phoneNumber);
    } catch (err) {
      return { valid: false, error: `PHONE_${err.message}` };
    }
  }

  return { valid: true };
}
