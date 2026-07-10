import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import BinMap from "../../components/map/BinMap.jsx";
import { getBins, createBin, updateBin, deleteBin } from "../../api/bins.js";
import { BIN_STATUS } from "../../lib/format.js";

export default function AdminBins() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = () => {
    setLoading(true);
    getBins()
      .then((d) => setBins(Array.isArray(d) ? d : d.bins || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    reset({ address: "", latitude: "", longitude: "", capacity: 100, status: "NORMAL" });
    setOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    reset({
      address: b.address,
      latitude: b.latitude,
      longitude: b.longitude,
      capacity: b.capacity,
      status: b.status,
    });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      address: data.address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      capacity: parseInt(data.capacity, 10),
      status: data.status,
    };
    try {
      if (editing) {
        await updateBin(editing.id, payload);
        toast.success("Bin updated");
      } else {
        await createBin(payload);
        toast.success("Bin created");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this bin?")) return;
    try {
      await deleteBin(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Bins" subtitle="Manage waste bins across the city." actions={<Button onClick={openNew}>➕ Add bin</Button>} />

      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <>
          <Card className="p-3 mb-6"><BinMap bins={bins} height={360} /></Card>

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background text-left text-xs font-semibold uppercase text-body">
                <tr>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Coordinates</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bins.map((b) => (
                  <tr key={b.id} className="hover:bg-background/60">
                    <td className="px-4 py-3 font-medium text-ink">{b.address}</td>
                    <td className="px-4 py-3 text-body">{b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}</td>
                    <td className="px-4 py-3 text-body">{b.capacity}</td>
                    <td className="px-4 py-3"><Badge status={b.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(b)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => onDelete(b.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bins.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-body">No bins yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit bin" : "New bin"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Address" {...register("address", { required: true })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" type="number" step="any" {...register("latitude", { required: true })} />
            <Input label="Longitude" type="number" step="any" {...register("longitude", { required: true })} />
          </div>
          <Input label="Capacity" type="number" {...register("capacity", { required: true })} />
          <Select label="Status" {...register("status")}>
            {BIN_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{editing ? "Save" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
