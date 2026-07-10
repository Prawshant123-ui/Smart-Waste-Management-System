import api from "./axios";

export const assignTask = (data) =>
  api.post("/collections/assign", data).then((r) => r.data);
export const getMyTasks = () =>
  api.get("/collections/mine").then((r) => r.data);
export const updateTaskStatus = (id, status) =>
  api.patch(`/collections/${id}/status`, { status }).then((r) => r.data);
export const completeTask = (id, formData) =>
  api.patch(`/collections/${id}/complete`, formData).then((r) => r.data);
