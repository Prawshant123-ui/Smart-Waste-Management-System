export default function Spinner({ size = 24 }) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-primary/20 border-t-primary"
      style={{ width: size, height: size }}
    />
  );
}
