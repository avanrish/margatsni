export default function getOtherParticipants(arr, currUserId) {
  const participantsWithoutCurrUser = arr.filter((u) => u.uid !== currUserId);
  return Object.assign(
    {},
    ...participantsWithoutCurrUser.map((object) => ({ [object.uid]: object }))
  );
}
