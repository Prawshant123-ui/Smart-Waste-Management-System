import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { getComplaint, deleteComplaint } from "../../api/complaints.js";
import { formatDate } from "../../lib/format.js";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getComplaint(id)
      .then((d) => setC(d.complaint || d))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    if (!confirm("Delete this report?")) return;
    try {
      await deleteComplaint(id);
      toast.success("Deleted");
      navigate("/citizen/complaints");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!c) return null;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Report details"
        subtitle={formatDate(c.createdAt)}
        actions={
          c.status === "PENDING" && (
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          )
        }
      />

      <Card className="overflow-hidden">
        {c.image && <img src={c.image} alt="" className="w-full max-h-96 object-cover" />}
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <Badge status={c.status} />
            <Badge status={c.priority} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-body">Description</div>
            <p className="mt-1 text-sm text-ink">{c.description || "—"}</p>
          </div>
          {c.bin && (
            <div>
              <div className="text-xs font-semibold uppercase text-body">Bin</div>
              <p className="mt-1 text-sm text-ink">{c.bin.address}</p>
            </div>
          )}
          {c.collection && (
            <div>
              <div className="text-xs font-semibold uppercase text-body">Collection</div>
              <p className="mt-1 text-sm text-ink">Status: {c.collection.status}</p>
              {c.collection.completionPhoto && (
                <img
                  src={c.collection.completionPhoto}
                  alt="Completion"
                  className="mt-2 max-h-48 rounded-xl border border-line"
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
