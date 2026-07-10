import api from "./axios";

export const getBins = () => api.get("/bins").then((r) => r.data);
export const getBin = (id) => api.get(`/bins/${id}`).then((r) => r.data);
export const createBin = (data) => api.post("/bins", data).then((r) => r.data);
export const updateBin = (id, data) =>
  api.patch(`/bins/${id}`, data).then((r) => r.data);
export const deleteBin = (id) =>
  api.delete(`/bins/${id}`).then((r) => r.data);
