import Card from "./Card.jsx";

export default function EmptyState({ title, description, action, icon = "📭" }) {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-body">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
