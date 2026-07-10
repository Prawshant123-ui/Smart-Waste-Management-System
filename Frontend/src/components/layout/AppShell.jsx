import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import clsx from "clsx";

const linksByRole = {
  ADMIN: [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/bins", label: "Bins", icon: "🗑️" },
    { to: "/admin/vehicles", label: "Vehicles", icon: "🚛" },
    { to: "/admin/complaints", label: "Complaints", icon: "📝" },
    { to: "/admin/users", label: "Users", icon: "👥" },
  ],
  COLLECTOR: [
    { to: "/collector", label: "Dashboard", icon: "📊", end: true },
    { to: "/collector/tasks", label: "My Tasks", icon: "✅" },
  ],
  CITIZEN: [
    { to: "/citizen", label: "Dashboard", icon: "📊", end: true },
    { to: "/citizen/complaints", label: "My Reports", icon: "📝" },
    { to: "/citizen/complaints/new", label: "Report Issue", icon: "➕" },
    { to: "/citizen/bins", label: "Bins Map", icon: "🗺️" },
  ],
};

export default function AppShell({ children }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links = linksByRole[role] || [];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-line px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold">
            C
          </div>
          <div>
            <div className="text-sm font-bold text-ink">CleanCity</div>
            <div className="text-xs text-body">Smart Waste</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-body hover:bg-line/40 hover:text-ink"
                )
              }
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <div className="rounded-xl bg-background p-3">
            <div className="text-sm font-semibold text-ink truncate">
              {user?.name}
            </div>
            <div className="text-xs text-body">{role}</div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-body hover:bg-line/40"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-surface/80 px-4 backdrop-blur md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              C
            </div>
            <span className="font-bold text-ink">CleanCity</span>
          </div>
          <div className="hidden md:block text-sm text-body">
            Welcome back, <span className="font-semibold text-ink">{user?.name}</span>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-body"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>

        <nav className="sticky bottom-0 flex items-center justify-around border-t border-line bg-surface p-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium",
                  isActive ? "text-primary" : "text-body"
                )
              }
            >
              <span className="text-lg">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
