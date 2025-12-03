import http from "./http";
import { listUsersApi } from "./userMgmtApi"; // ← adăugăm asta

export const listDevicesApi = () => http.get("/api/devices");
export const getDeviceApi = (id) => http.get(`/api/devices/${id}`);
export const createDeviceApi = ({ name, maximumConsumption, userId }) =>
  http.post("/api/devices", { name, maximumConsumption, userId });

export const updateDeviceApi = (id, { name, maximumConsumption, userId }) =>
  http.put(`/api/devices/${id}`, { name, maximumConsumption, userId });

export const deleteDeviceApi = (id) => http.delete(`/api/devices/${id}`);

export const listDevicesForUserApi = (userId) =>
  http.get(`/api/devices/user/${userId}`);

export { listUsersApi };
