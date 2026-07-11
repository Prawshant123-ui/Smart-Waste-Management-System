import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Select from "../../components/ui/Select.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { getComplaint } from "../../api/complaints.js";
import { listUsers } from "../../api/users.js";
import { getVehicles } from "../../api/vehicles.js";
import { getBins } from "../../api/bins.js";
import { assignTask } from "../../api/collections.js";

export default function AssignTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();

  const selectedBinId = watch("binId");

  useEffect(() => {
    Promise.all([getComplaint(id), listUsers(), getVehicles(), getBins()])
      .then(([complaint, users, vs, bs]) => {
        setC(complaint.complaint || complaint);
        const list = Array.isArray(users) ? users : users.users || [];
        setCollectors(list.filter((u) => u.role === "COLLECTOR"));
        const v = Array.isArray(vs) ? vs : vs.vehicles || [];
        setVehicles(v.filter((x) => x.status === "AVAILABLE"));
        const b = Array.isArray(bs) ? bs : bs.bins || [];
        setBins(b);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data) => {
    try {
      await assignTask({
        complaintId: id,
        collectorId: data.collectorId,
        vehicleId: data.vehicleId,
        binId: c?.binId || data.binId,
      });
      toast.success("Task assigned");
      navigate("/admin/complaints");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!c) return null;

  const hasBin = Boolean(c.binId || selectedBinId);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Assign task" subtitle="Dispatch a collector and vehicle." actions={<Badge status={c.status} />} />

      <Card className="p-6">
        <div className="mb-6 rounded-xl bg-background p-4">
          <div className="text-xs font-semibold uppercase text-body">Complaint</div>
          <div className="mt-1 text-sm text-ink">{c.description || "—"}</div>
          <div className="mt-1 text-xs text-body">Bin: {c.bin?.address || "—"}</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Collector" {...register("collectorId", { required: true })}>
            <option value="">— Select collector —</option>
            {collectors.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </Select>
          <Select label="Vehicle (available)" {...register("vehicleId", { required: true })}>
            <option value="">— Select vehicle —</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.vehicleNumber} — {v.driver}</option>
            ))}
          </Select>

          {!c.binId && (
            <>
              <Select label="Bin" {...register("binId", { required: true })}>
                <option value="">— Select bin —</option>
                {bins.map((b) => (
                  <option key={b.id} value={b.id}>{b.address}</option>
                ))}
              </Select>
              <div className="text-sm text-warning">
                This complaint has no linked bin. Pick one above before assigning.
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !hasBin}>Assign</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}