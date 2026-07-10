import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { getMyTasks } from "../../api/collections.js";
import { formatDate } from "../../lib/format.js";

export default function MyTasks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTasks()
      .then((d) => setItems(Array.isArray(d) ? d : d.tasks || d.collections || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="My tasks" subtitle="Bins assigned to you." />
      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : items.length === 0 ? (
        <EmptyState title="No tasks" description="Nothing assigned right now." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-center justify-between">
                <Badge status={c.status} />
                <span className="text-xs text-body">{formatDate(c.createdAt)}</span>
              </div>
              <div className="mt-3 text-lg font-semibold text-ink">
                {c.bin?.address || "Bin"}
              </div>
              <div className="text-xs text-body">
                🚛 {c.vehicle?.vehicleNumber || "—"} · Fuel: {c.vehicle?.fuelType || "—"}
              </div>
              <div className="mt-4">
                <Link
                  to={`/collector/tasks/${c.id}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Open task →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
