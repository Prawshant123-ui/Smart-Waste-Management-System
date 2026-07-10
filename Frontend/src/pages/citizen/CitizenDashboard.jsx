import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { getCitizenDashboard } from "../../api/dashboard.js";
import { chartTheme, commonOptions } from "../../components/charts/chartSetup.js";
import { formatDate } from "../../lib/format.js";

export default function CitizenDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCitizenDashboard()
      .then(setData)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!data) return null;

  const t = data.totals || {};
  const doughnut = {
    labels: ["Resolved", "Pending"],
    datasets: [
      {
        data: [t.resolvedComplaints || 0, t.pendingComplaints || 0],
        backgroundColor: [chartTheme.primary, chartTheme.warning],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div>
      <PageHeader
        title="Your dashboard"
        subtitle="Track your reports and stay updated."
        actions={
          <Button as={Link} to="/citizen/complaints/new">➕ Report an issue</Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total reports" value={t.totalComplaints} tone="primary" icon="📝" />
        <StatCard label="Resolved" value={t.resolvedComplaints} tone="secondary" icon="✅" />
        <StatCard label="In progress" value={t.pendingComplaints} tone="warning" icon="⏳" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-1">
          <h3 className="text-sm font-semibold text-ink">Status breakdown</h3>
          <div className="mt-4 h-56">
            <Doughnut
              data={doughnut}
              options={{
                ...commonOptions,
                scales: {},
                cutout: "65%",
              }}
            />
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Recent reports</h3>
            <Link to="/citizen/complaints" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          {(data.recentComplaints || []).length === 0 ? (
            <EmptyState
              title="No reports yet"
              description="Spotted an overflowing bin? Let us know."
              action={<Button as={Link} to="/citizen/complaints/new">Report now</Button>}
            />
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.recentComplaints.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">
                      {c.description || "Complaint"}
                    </div>
                    <div className="text-xs text-body">
                      {c.bin?.address || "No bin"} · {formatDate(c.createdAt)}
                    </div>
                  </div>
                  <Badge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
