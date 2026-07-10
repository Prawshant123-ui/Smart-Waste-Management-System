import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { getMyComplaints, deleteComplaint } from "../../api/complaints.js";
import { formatDate } from "../../lib/format.js";

export default function MyComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMyComplaints()
      .then((d) => setItems(Array.isArray(d) ? d : d.complaints || d.items || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this report?")) return;
    try {
      await deleteComplaint(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="My reports"
        subtitle="Everything you've reported."
        actions={<Button as={Link} to="/citizen/complaints/new">➕ New report</Button>}
      />

      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Start by reporting an issue you noticed."
          action={<Button as={Link} to="/citizen/complaints/new">Report an issue</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              {c.image && (
                <img src={c.image} alt="" className="h-40 w-full object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <Badge status={c.status} />
                  <Badge status={c.priority} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-ink">
                  {c.description || "No description"}
                </p>
                <div className="mt-2 text-xs text-body">
                  {c.bin?.address || "—"} · {formatDate(c.createdAt)}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/citizen/complaints/${c.id}`} className="text-sm font-semibold text-primary hover:underline">
                    View details
                  </Link>
                  {c.status === "PENDING" && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(c.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
