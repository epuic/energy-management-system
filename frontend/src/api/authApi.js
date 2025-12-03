import http from "./http";

export const loginApi = (username, password) =>
  http.post("/api/auth/login", { username, password });

export const registerApi = (username, password) =>
  http.post("/api/auth/register", {
    username,
    password,
    role: "CLIENT",
  });
