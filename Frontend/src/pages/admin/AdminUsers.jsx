import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Input from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {
  listUsers,
  createCollector,
  updateCollector,
  deleteCollector,
} from "../../api/users.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = () => {
    setLoading(true);
    listUsers()
      .then((d) => setUsers(Array.isArray(d) ? d : d.users || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    reset({ name: "", email: "", phone: "", password: "" });
    setOpen(true);
  };
  const openEdit = (u) => {
    setEditing(u);
    reset({ name: u.name, email: u.email, phone: u.phone });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        const payload = { name: data.name, email: data.email, phone: data.phone };
        await updateCollector(editing.id, payload);
        toast.success("Updated");
      } else {
        await createCollector(data);
        toast.success("Collector added");
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this collector?")) return;
    try {
      await deleteCollector(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="All users. Manage collectors here." actions={<Button onClick={openNew}>➕ Add collector</Button>} />

      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background text-left text-xs font-semibold uppercase text-body">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-background/60">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-body">{u.email}</td>
                  <td className="px-4 py-3 text-body">{u.phone}</td>
                  <td className="px-4 py-3"><Badge tone={u.role === "ADMIN" ? "accent" : u.role === "COLLECTOR" ? "success" : "muted"}>{u.role}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    {u.role === "COLLECTOR" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(u)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => onDelete(u.id)}>Delete</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-body">No users.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit collector" : "New collector"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Name" {...register("name", { required: true })} />
          <Input label="Email" type="email" {...register("email", { required: true })} />
          <Input label="Phone" {...register("phone", { required: true })} />
          {!editing && (
            <Input label="Password" type="password" {...register("password", { required: true, minLength: 8 })} />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{editing ? "Save" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
