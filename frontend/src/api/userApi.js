import http from "./http";

export const createUserWithIdApi = ({ id, username, role }) =>
  http.post("/api/users/create-with-id", { id, username, role });