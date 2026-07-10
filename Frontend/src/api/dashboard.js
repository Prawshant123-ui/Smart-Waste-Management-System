import api from "./axios";

export const getAdminDashboard = () =>
  api.get("/dashboard/admin").then((r) => r.data);
export const getCollectorDashboard = () =>
  api.get("/dashboard/collector").then((r) => r.data);
export const getCitizenDashboard = () =>
  api.get("/dashboard/citizen").then((r) => r.data);
