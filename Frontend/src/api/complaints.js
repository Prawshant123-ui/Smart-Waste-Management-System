import api from "./axios";

export const createComplaint = (formData) =>
  api.post("/complaints", formData).then((r) => r.data);
export const getMyComplaints = () =>
  api.get("/complaints/mine").then((r) => r.data);
export const getAllComplaints = () =>
  api.get("/complaints").then((r) => r.data);
export const getComplaint = (id) =>
  api.get(`/complaints/${id}`).then((r) => r.data);
export const updateComplaint = (id, data) =>
  api.patch(`/complaints/${id}`, data).then((r) => r.data);
export const deleteComplaint = (id) =>
  api.delete(`/complaints/${id}`).then((r) => r.data);
export const approveComplaint = (id, data = {}) =>
  api.patch(`/complaints/${id}/approve`, data).then((r) => r.data);
