import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Select from "../../components/ui/Select.jsx";
import Button from "../../components/ui/Button.jsx";
import { createComplaint } from "../../api/complaints.js";
import { getBins } from "../../api/bins.js";
import { COMPLAINT_PRIORITY } from "../../lib/format.js";

export default function NewComplaint() {
  const [params] = useSearchParams();
  const preselectedBin = params.get("binId") || "";
  const [bins, setBins] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { priority: "MEDIUM", binId: preselectedBin },
  });

  useEffect(() => {
    getBins()
      .then((d) => setBins(Array.isArray(d) ? d : d.bins || []))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please attach a photo");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("image", file);
      if (data.description) fd.append("description", data.description);
      fd.append("priority", data.priority);
      if (data.binId) fd.append("binId", data.binId);
      await createComplaint(fd);
      toast.success("Report submitted");
      navigate("/citizen/complaints");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Report an issue" subtitle="Help us fix it faster with a clear photo and details." />

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full rounded-xl border border-line bg-surface p-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white file:font-semibold"
            />
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="mt-3 max-h-48 rounded-xl border border-line object-cover"
              />
            )}
          </div>

          <Textarea
            label="Description"
            rows={4}
            placeholder="What's the issue?"
            {...register("description")}
          />

          <Select label="Priority" {...register("priority")}>
            {COMPLAINT_PRIORITY.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>

          <Select label="Related bin (optional)" {...register("binId")}>
            <option value="">— None —</option>
            {bins.map((b) => (
              <option key={b.id} value={b.id}>
                {b.address} ({b.status})
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit report"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
