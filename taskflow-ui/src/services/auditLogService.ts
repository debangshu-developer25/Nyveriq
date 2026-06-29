import api from "./api";

export const getRecentAuditLogs = async () => {

  const response = await api.get("/AuditLogs/recent");

  return response.data;
};