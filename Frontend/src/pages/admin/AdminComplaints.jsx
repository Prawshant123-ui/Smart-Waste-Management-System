import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { getAllComplaints, approveComplaint } from "../../api/complaints.js";
import { formatDate } from "../../lib/format.js";

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllComplaints()
      .then((d) => setItems(Array.isArray(d) ? d : d.complaints || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onApprove = async (id) => {
    try {
      await approveComplaint(id);
      toast.success("Approved");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Complaints" subtitle="Approve and assign incoming reports." />

      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              {c.image && <img src={c.image} alt="" className="h-40 w-full object-cover" />}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <Badge status={c.status} />
                  <Badge status={c.priority} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-ink">{c.description || "—"}</p>
                <div className="mt-2 text-xs text-body">
                  {c.bin?.address || "No bin"} · {formatDate(c.createdAt)}
                </div>
                <div className="mt-4 flex gap-2">
                  {c.status === "PENDING" && (
                    <Button size="sm" onClick={() => onApprove(c.id)}>Approve</Button>
                  )}
                  {c.status === "APPROVED" && (
                    <Button size="sm" as={Link} to={`/admin/complaints/${c.id}/assign`}>
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-body p-10">No complaints.</div>
          )}
        </div>
      )}
    </div>
  );
}
