import http from "./http";

export const listUsersApi = () => http.get("/api/users");

export const getMeApi = () => http.get("/api/users/me");

export const createUserInUserDbApi = ({ username, role }) =>
  http.post("/api/users", { username, role });
export const updateUserInUserDbApi = (id, { username, role }) =>
  http.put(`/api/users/${id}`, { username, role });
export const deleteUserInUserDbApi = (id) =>
  http.delete(`/api/users/${id}`);

export const createUserInAuthDbWithIdApi = ({ id, username, password, role }) =>
  http.post("/api/auth/create-with-id", { id, username, password, role });
export const updateUserInAuthDbApi = (id, payload) =>
  http.put(`/api/auth/update/${id}`, payload);
export const deleteUserInAuthDbApi = (id) =>
  http.delete(`/api/auth/delete/${id}`);
