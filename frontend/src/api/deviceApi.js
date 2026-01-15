import http from "./http";
import { listUsersApi } from "./userMgmtApi";

export const listDevicesApi = () => http.get("/api/devices");
export const getDeviceApi = (id) => http.get(`/api/devices/${id}`);

// ADAUGĂ 'username' AICI:
export const createDeviceApi = ({ name, maximumConsumption, userId, username }) =>
  http.post("/api/devices", { name, maximumConsumption, userId, username });

// ȘI AICI:
export const updateDeviceApi = (id, { name, maximumConsumption, userId, username }) =>
  http.put(`/api/devices/${id}`, { name, maximumConsumption, userId, username });

export const deleteDeviceApi = (id) => http.delete(`/api/devices/${id}`);

export const listDevicesForUserApi = (userId) =>
  http.get(`/api/devices/user/${userId}`);

export { listUsersApi };