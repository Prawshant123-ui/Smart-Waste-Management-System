import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Card from "../../components/ui/Card.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import BinMap from "../../components/map/BinMap.jsx";
import { getAdminDashboard } from "../../api/dashboard.js";
import { chartTheme, commonOptions } from "../../components/charts/chartSetup.js";

const groupCount = (arr) => {
  const out = {};
  (arr || []).forEach((x) => {
    const k = x.status || x.key || "OTHER";
    out[k] = (x._count?.status ?? x._count ?? x.count ?? 0);
  });
  return out;
};

const PALETTE = ["#22C55E", "#14B8A6", "#06B6D4", "#F59E0B", "#EF4444", "#6366F1"];

export default function AdminDashboard() {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(setD)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Spinner /></div>;
  if (!d) return null;

  const t = d.totals || {};
  const cByStatus = groupCount(d.complaintsByStatus);
  const bByStatus = groupCount(d.binsByStatus);

  const complaintDoughnut = {
    labels: Object.keys(cByStatus),
    datasets: [
      {
        data: Object.values(cByStatus),
        backgroundColor: PALETTE,
        borderWidth: 0,
      },
    ],
  };
  const binDoughnut = {
    labels: Object.keys(bByStatus),
    datasets: [
      {
        data: Object.values(bByStatus),
        backgroundColor: [chartTheme.primary, chartTheme.warning, chartTheme.error],
        borderWidth: 0,
      },
    ],
  };

  const complaintsPerDay = d.complaintsPerDay || [];
  const lineData = {
    labels: complaintsPerDay.map((r) =>
      new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    ),
    datasets: [
      {
        label: "Complaints",
        data: complaintsPerDay.map((r) => Number(r.count) || 0),
        borderColor: chartTheme.primary,
        backgroundColor: `${chartTheme.primary}22`,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: chartTheme.primary,
      },
    ],
  };

  const perf = d.collectorPerformance || [];
  const perfBar = {
    labels: perf.map((p) => p.collectorName),
    datasets: [
      {
        label: "Completed",
        data: perf.map((p) => Number(p.completedTasks) || 0),
        backgroundColor: chartTheme.primary,
        borderRadius: 6,
      },
      {
        label: "Total",
        data: perf.map((p) => Number(p.totalTasks) || 0),
        backgroundColor: chartTheme.accent,
        borderRadius: 6,
      },
    ],
  };

  const veh = d.vehicleUtilization || [];
  const vehBar = {
    labels: veh.map((v) => v.vehicleNumber),
    datasets: [
      {
        label: "Trips",
        data: veh.map((v) => Number(v.totalTrips) || 0),
        backgroundColor: chartTheme.secondary,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <PageHeader title="Admin dashboard" subtitle="City-wide operations at a glance." />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Bins" value={t.totalBins} tone="primary" icon="🗑️" />
        <StatCard label="Complaints" value={t.totalComplaints} tone="accent" icon="📝" />
        <StatCard label="Collectors" value={t.totalCollectors} tone="secondary" icon="👷" />
        <StatCard label="Vehicles" value={t.totalVehicles} tone="warning" icon="🚛" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold text-ink">Avg collection time</div>
          <div className="mt-1 text-3xl font-bold text-ink">
            {d.avgCollectionTime || 0}
            <span className="ml-1 text-base font-medium text-body">min</span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-ink">Resolution rate</div>
          <div className="mt-1 text-3xl font-bold text-primary">
            {d.resolutionRate || 0}
            <span className="ml-1 text-base font-medium text-body">%</span>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Complaints by status</h3>
          <div className="mt-4 h-56">
            <Doughnut data={complaintDoughnut} options={{ ...commonOptions, scales: {}, cutout: "60%" }} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Bins by status</h3>
          <div className="mt-4 h-56">
            <Doughnut data={binDoughnut} options={{ ...commonOptions, scales: {}, cutout: "60%" }} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Complaints (30 days)</h3>
          <div className="mt-4 h-56">
            <Line data={lineData} options={commonOptions} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Collector performance</h3>
          <div className="mt-4 h-64">
            <Bar data={perfBar} options={commonOptions} />
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink">Vehicle utilization</h3>
          <div className="mt-4 h-64">
            <Bar data={vehBar} options={commonOptions} />
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-3">
        <div className="mb-3 px-2 pt-2 text-sm font-semibold text-ink">Overflow hotspots</div>
        <BinMap bins={d.overflowHotspots || []} height={420} />
      </Card>
    </div>
  );
}
