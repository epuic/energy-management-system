import { createContext, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode"; // v4: named export
import { loginApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      const d = jwtDecode(t);
      return { username: d.sub, roles: d.roles || [] };
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    const res = await loginApi(username, password);
    const t = res.data.token;
    localStorage.setItem("token", t);
    setToken(t);
    const d = jwtDecode(t);
    setUser({ username: d.sub, roles: d.roles || [] });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isLoggedIn: !!token,
      hasRole: (r) => user?.roles?.includes(r),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
