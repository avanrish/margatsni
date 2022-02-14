export default function notificationText(type, t) {
  if (type === 'like') return t`likeNotification`;
  if (type === 'comment') return t`commentNotification`;
  if (type === 'follow') return t`followNotification`;
  if (type === 'newChat') return t`newChatNotification`;
  return t`leftChatNotification`;
}
