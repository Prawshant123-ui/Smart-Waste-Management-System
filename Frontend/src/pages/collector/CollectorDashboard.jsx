import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import { getCollectorDashboard } from "../../api/dashboard.js";
import { chartTheme, commonOptions } from "../../components/charts/chartSetup.js";
import { formatDate } from "../../lib/format.js";

export default function CollectorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollectorDashboard()
      .then(setData)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!data) return null;

  const t = data.totals || {};
  const bar = {
    labels: ["Assigned", "In progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [t.assignedTasks || 0, t.inProgressTasks || 0, t.completedTasks || 0],
        backgroundColor: [chartTheme.accent, chartTheme.warning, chartTheme.primary],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div>
      <PageHeader
        title="Your day at a glance"
        subtitle={`Average time per task: ${data.avgMinutesPerTask || 0} min`}
        actions={<Button as={Link} to="/collector/tasks">Open tasks</Button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total" value={t.totalTasks} tone="primary" icon="📦" />
        <StatCard label="Assigned" value={t.assignedTasks} tone="accent" icon="📥" />
        <StatCard label="In progress" value={t.inProgressTasks} tone="warning" icon="⏳" />
        <StatCard label="Completed" value={t.completedTasks} tone="secondary" icon="✅" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-1">
          <h3 className="text-sm font-semibold text-ink">Task distribution</h3>
          <div className="mt-4 h-56">
            <Bar data={bar} options={commonOptions} />
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Recent tasks</h3>
            <Link to="/collector/tasks" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {(data.recentTasks || []).length === 0 ? (
            <EmptyState title="No tasks yet" description="You're all caught up." />
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.recentTasks.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">
                      {c.bin?.address || "Bin"}
                    </div>
                    <div className="text-xs text-body">
                      🚛 {c.vehicle?.vehicleNumber} · {formatDate(c.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={c.status} />
                    <Link to={`/collector/tasks/${c.id}`} className="text-xs font-semibold text-primary hover:underline">
                      Open →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
