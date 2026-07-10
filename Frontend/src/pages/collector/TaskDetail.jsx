import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import BinMap from "../../components/map/BinMap.jsx";
import { getMyTasks, updateTaskStatus, completeTask } from "../../api/collections.js";
import { formatDate } from "../../lib/format.js";

export default function TaskDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const task = useMemo(() => items.find((t) => t.id === id), [items, id]);

  const load = () => {
    setLoading(true);
    getMyTasks()
      .then((d) => setItems(Array.isArray(d) ? d : d.tasks || d.collections || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const start = async () => {
    setBusy(true);
    try {
      await updateTaskStatus(id, "IN_PROGRESS");
      toast.success("Task started");
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const complete = async () => {
    if (!file) return toast.error("Attach a completion photo");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      await completeTask(id, fd);
      toast.success("Task completed");
      navigate("/collector/tasks");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!task) return <div className="text-body">Task not found.</div>;

  return (
    <div>
      <PageHeader
        title={task.bin?.address || "Task"}
        subtitle={`Created ${formatDate(task.createdAt)}`}
        actions={<Badge status={task.status} />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-3 md:col-span-2">
          {task.bin && (
            <BinMap bins={[task.bin]} height={380} zoom={15} center={[task.bin.latitude, task.bin.longitude]} />
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Vehicle</h3>
          <p className="mt-1 text-sm text-body">
            {task.vehicle?.vehicleNumber} · {task.vehicle?.driver}
          </p>

          <h3 className="mt-4 text-sm font-semibold text-ink">Bin</h3>
          <p className="mt-1 text-sm text-body">
            Status: <span className="font-medium">{task.bin?.status}</span>
          </p>

          <div className="mt-6 space-y-3">
            {task.status === "ASSIGNED" && (
              <Button onClick={start} disabled={busy} className="w-full">
                Start collection
              </Button>
            )}

            {task.status === "IN_PROGRESS" && (
              <>
                <label className="block text-sm font-medium text-ink">Completion photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-xl border border-line bg-surface p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white file:font-semibold"
                />
                {file && (
                  <img src={URL.createObjectURL(file)} alt="" className="max-h-40 rounded-xl border border-line object-cover" />
                )}
                <Button onClick={complete} disabled={busy} className="w-full">
                  Mark as completed
                </Button>
              </>
            )}

            {task.status === "COMPLETED" && task.completionPhoto && (
              <img src={task.completionPhoto} alt="" className="rounded-xl border border-line" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
