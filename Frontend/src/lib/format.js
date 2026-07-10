export const roleHome = (role) => {
  if (role === "ADMIN") return "/admin";
  if (role === "COLLECTOR") return "/collector";
  if (role === "CITIZEN") return "/citizen";
  return "/";
};

export const BIN_STATUS = ["NORMAL", "FULL", "OVERFLOWING"];
export const VEHICLE_STATUS = ["AVAILABLE", "IN_USE", "MAINTENANCE"];
export const COMPLAINT_STATUS = [
  "PENDING",
  "APPROVED",
  "ASSIGNED",
  "RESOLVED",
  "REJECTED",
];
export const COMPLAINT_PRIORITY = ["LOW", "MEDIUM", "CRITICAL"];
export const COLLECTION_STATUS = ["ASSIGNED", "IN_PROGRESS", "COMPLETED"];

export const statusColor = (status) => {
  switch (status) {
    case "NORMAL":
    case "COMPLETED":
    case "RESOLVED":
    case "AVAILABLE":
      return "success";
    case "FULL":
    case "PENDING":
    case "MAINTENANCE":
    case "MEDIUM":
      return "warning";
    case "OVERFLOWING":
    case "REJECTED":
    case "CRITICAL":
      return "error";
    case "APPROVED":
    case "ASSIGNED":
    case "IN_PROGRESS":
    case "IN_USE":
    case "LOW":
      return "accent";
    default:
      return "muted";
  }
};

export const binMarkerColor = (status) => {
  if (status === "OVERFLOWING") return "#EF4444";
  if (status === "FULL") return "#F59E0B";
  return "#22C55E";
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};
