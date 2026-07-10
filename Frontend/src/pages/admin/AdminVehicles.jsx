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
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "../../api/vehicles.js";
import { VEHICLE_STATUS } from "../../lib/format.js";

export default function AdminVehicles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = () => {
    setLoading(true);
    getVehicles()
      .then((d) => setItems(Array.isArray(d) ? d : d.vehicles || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    reset({ vehicleNumber: "", driver: "", fuelType: "Diesel", status: "AVAILABLE" });
    setOpen(true);
  };
  const openEdit = (v) => {
    setEditing(v);
    reset(v);
    setOpen(true);
  };
  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateVehicle(editing.id, data);
        toast.success("Vehicle updated");
      } else {
        await createVehicle(data);
        toast.success("Vehicle added");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const onDelete = async (id) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Vehicles" subtitle="Fleet management." actions={<Button onClick={openNew}>➕ Add vehicle</Button>} />

      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background text-left text-xs font-semibold uppercase text-body">
              <tr>
                <th className="px-4 py-3">Vehicle #</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Fuel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((v) => (
                <tr key={v.id} className="hover:bg-background/60">
                  <td className="px-4 py-3 font-medium text-ink">{v.vehicleNumber}</td>
                  <td className="px-4 py-3 text-body">{v.driver}</td>
                  <td className="px-4 py-3 text-body">{v.fuelType}</td>
                  <td className="px-4 py-3"><Badge status={v.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(v)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(v.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-body">No vehicles.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit vehicle" : "New vehicle"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Vehicle number" {...register("vehicleNumber", { required: true })} />
          <Input label="Driver" {...register("driver", { required: true })} />
          <Input label="Fuel type" {...register("fuelType", { required: true })} />
          <Select label="Status" {...register("status")}>
            {VEHICLE_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
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
