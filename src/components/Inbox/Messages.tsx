export default function Messages({ messages }) {
  return <div>{messages.map((m) => m.message)}</div>;
}
