type Props = { name: string; onSelect: () => void };
export function ProfileCard({ name, onSelect }: Props) {
  return (
    <button
      type="button"
      className="profile-card"
      onClick={onSelect}
    >
      <span>Hello, {name}</span>
    </button>
  );
}
