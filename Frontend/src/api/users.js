import api from "./axios";

export const listUsers = () => api.get("/users").then((r) => r.data);
export const createCollector = (data) =>
  api.post("/users/collectors", data).then((r) => r.data);
export const updateCollector = (id, data) =>
  api.patch(`/users/collectors/${id}`, data).then((r) => r.data);
export const deleteCollector = (id) =>
  api.delete(`/users/collectors/${id}`).then((r) => r.data);
