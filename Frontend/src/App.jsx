import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext.jsx";
import { roleHome } from "./lib/format.js";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import PageTransition from "./components/motion/PageTransition.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

import CitizenDashboard from "./pages/citizen/CitizenDashboard.jsx";
import MyComplaints from "./pages/citizen/MyComplaints.jsx";
import NewComplaint from "./pages/citizen/NewComplaint.jsx";
import ComplaintDetail from "./pages/citizen/ComplaintDetail.jsx";
import BinsMapPage from "./pages/citizen/BinsMap.jsx";

import CollectorDashboard from "./pages/collector/CollectorDashboard.jsx";
import MyTasks from "./pages/collector/MyTasks.jsx";
import TaskDetail from "./pages/collector/TaskDetail.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminBins from "./pages/admin/AdminBins.jsx";
import AdminVehicles from "./pages/admin/AdminVehicles.jsx";
import AdminComplaints from "./pages/admin/AdminComplaints.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AssignTask from "./pages/admin/AssignTask.jsx";

function Guarded({ roles, children }) {
  return (
    <ProtectedRoute roles={roles}>
      <AppShell>
        <PageTransition>{children}</PageTransition>
      </AppShell>
    </ProtectedRoute>
  );
}

function LandingOrRedirect() {
  const { token, role } = useAuth();
  if (token) return <Navigate to={roleHome(role)} replace />;
  return <Landing />;
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingOrRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen */}
        <Route path="/citizen" element={<Guarded roles={["CITIZEN"]}><CitizenDashboard /></Guarded>} />
        <Route path="/citizen/complaints" element={<Guarded roles={["CITIZEN"]}><MyComplaints /></Guarded>} />
        <Route path="/citizen/complaints/new" element={<Guarded roles={["CITIZEN"]}><NewComplaint /></Guarded>} />
        <Route path="/citizen/complaints/:id" element={<Guarded roles={["CITIZEN"]}><ComplaintDetail /></Guarded>} />
        <Route path="/citizen/bins" element={<Guarded roles={["CITIZEN"]}><BinsMapPage /></Guarded>} />

        {/* Collector */}
        <Route path="/collector" element={<Guarded roles={["COLLECTOR"]}><CollectorDashboard /></Guarded>} />
        <Route path="/collector/tasks" element={<Guarded roles={["COLLECTOR"]}><MyTasks /></Guarded>} />
        <Route path="/collector/tasks/:id" element={<Guarded roles={["COLLECTOR"]}><TaskDetail /></Guarded>} />

        {/* Admin */}
        <Route path="/admin" element={<Guarded roles={["ADMIN"]}><AdminDashboard /></Guarded>} />
        <Route path="/admin/bins" element={<Guarded roles={["ADMIN"]}><AdminBins /></Guarded>} />
        <Route path="/admin/vehicles" element={<Guarded roles={["ADMIN"]}><AdminVehicles /></Guarded>} />
        <Route path="/admin/complaints" element={<Guarded roles={["ADMIN"]}><AdminComplaints /></Guarded>} />
        <Route path="/admin/complaints/:id/assign" element={<Guarded roles={["ADMIN"]}><AssignTask /></Guarded>} />
        <Route path="/admin/users" element={<Guarded roles={["ADMIN"]}><AdminUsers /></Guarded>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
