export default function removePrivateData(user) {
  delete user.timestamp;
  delete user.email;
  delete user.phoneNumber;
  delete user.gender;
}
