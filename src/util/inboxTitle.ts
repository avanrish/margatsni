export default function name(modalOpen, selectedChat, selectedTab, t) {
  if (modalOpen) return `${t`newMessage`} • Direct`;
  if (selectedChat && selectedTab === 0) return `Margatsni • Direct`;
  if (selectedChat && selectedTab === 1) return `${t`details`} • Direct`;
  return `${t`inbox`} • Direct`;
}
