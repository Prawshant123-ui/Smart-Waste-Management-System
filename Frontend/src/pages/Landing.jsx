import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BinMap from "../components/map/BinMap.jsx";
import { Line } from "react-chartjs-2";
import { commonOptions, chartTheme } from "../components/charts/chartSetup.js";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { roleHome } from "../lib/format.js";

const demoBins = [
  { id: "1", latitude: 28.6139, longitude: 77.209, address: "Connaught Place", status: "OVERFLOWING" },
  { id: "2", latitude: 28.62, longitude: 77.22, address: "Karol Bagh", status: "FULL" },
  { id: "3", latitude: 28.605, longitude: 77.19, address: "Rajiv Chowk", status: "NORMAL" },
  { id: "4", latitude: 28.61, longitude: 77.24, address: "ITO", status: "NORMAL" },
];

const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Complaints",
      data: [12, 19, 14, 22, 30, 18, 24],
      borderColor: chartTheme.primary,
      backgroundColor: `${chartTheme.primary}22`,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: chartTheme.primary,
    },
    {
      label: "Resolved",
      data: [10, 15, 12, 20, 25, 16, 22],
      borderColor: chartTheme.accent,
      backgroundColor: `${chartTheme.accent}22`,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: chartTheme.accent,
    },
  ],
};

function Feature({ icon, title, description, tone }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-line bg-surface p-6 shadow-card"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${tones[tone]}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-body">{description}</p>
    </motion.div>
  );
}

export default function Landing() {
  const { token, role } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-sm">
              C
            </div>
            <span className="text-lg font-bold text-ink">CleanCity</span>
          </Link>
          <nav className="hidden gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-body hover:text-ink">Features</a>
            <a href="#how" className="text-sm font-medium text-body hover:text-ink">How it works</a>
            <a href="#insights" className="text-sm font-medium text-body hover:text-ink">Insights</a>
          </nav>
          <div className="flex items-center gap-2">
            {token ? (
              <Button as={Link} to={roleHome(role)}>Go to app</Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" size="sm">Sign in</Button>
                <Button as={Link} to="/register" size="sm">Get started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live in your neighborhood
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink md:text-6xl">
              Cleaner cities,{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                powered by citizens
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-body md:text-lg">
              Report overflowing bins in seconds, track collections live on the map, and give
              administrators real-time analytics to deploy vehicles where they matter most.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} to="/register" size="lg">Report an issue →</Button>
              <Button as={Link} to="/login" variant="outline" size="lg">
                Sign in
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-body">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Normal bins</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" /> Filling up</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-error" /> Overflowing</div>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-5"
            id="insights"
          >
            <div className="md:col-span-3 rounded-2xl border border-line bg-surface p-3 shadow-card">
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="text-sm font-semibold text-ink">Live bin status</div>
                <span className="text-xs text-body">Demo view</span>
              </div>
              <div className="h-[320px]">
                <BinMap bins={demoBins} height={320} zoom={12} />
              </div>
            </div>
            <div className="md:col-span-2 rounded-2xl border border-line bg-surface p-5 shadow-card">
              <div className="text-sm font-semibold text-ink">Complaints this week</div>
              <p className="text-xs text-body">Reported vs resolved</p>
              <div className="mt-4 h-[260px]">
                <Line data={chartData} options={commonOptions} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Built for every role in the loop</h2>
          <p className="mt-3 text-body">
            From the citizen who spots an overflowing bin to the admin dispatching the crew.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Feature
            tone="primary"
            icon="📸"
            title="Report in a snap"
            description="Snap a photo, pin the location, and file a complaint in seconds. Track it end-to-end."
          />
          <Feature
            tone="secondary"
            icon="🚛"
            title="Smart dispatch"
            description="Admins assign collectors and vehicles to approved complaints with one click."
          />
          <Feature
            tone="accent"
            icon="📊"
            title="Real-time insights"
            description="Live dashboards for hotspots, collector performance, and resolution rates."
          />
        </div>
      </section>

      {/* How */}
      <section id="how" className="bg-surface/60 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Citizens report", d: "Upload a photo of an overflowing bin and describe the issue." },
              { n: "02", t: "Admins assign", d: "Approve reports and dispatch the nearest available crew." },
              { n: "03", t: "Collectors act", d: "Complete tasks with proof-of-collection photos." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-line bg-surface p-6 shadow-card"
              >
                <div className="text-sm font-bold text-primary">{s.n}</div>
                <div className="mt-2 text-lg font-bold text-ink">{s.t}</div>
                <div className="mt-1 text-sm text-body">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-10 text-center text-white shadow-pop md:p-16">
          <h2 className="text-3xl font-extrabold md:text-4xl">Help keep your city clean.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            Join thousands of citizens making a visible difference every day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button as={Link} to="/register" variant="soft" size="lg" className="!bg-white !text-primary hover:!bg-white/90">
              Create your account
            </Button>
            <Button as={Link} to="/login" variant="ghost" size="lg" className="!text-white hover:!bg-white/10">
              I already have an account
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 md:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">C</div>
            <span className="text-sm font-semibold text-ink">CleanCity</span>
          </div>
          <p className="text-xs text-body">© {new Date().getFullYear()} CleanCity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
