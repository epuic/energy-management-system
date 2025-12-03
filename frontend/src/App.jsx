import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import RoleRoute from "./routes/RoleRoute";
import UsersPage from "./pages/UsersPage";
import DevicesPage from "./pages/DevicesPage";
import MyDevicesPage from "./pages/MyDevicesPage"; // <=== NOU
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-devices" element={<MyDevicesPage />} /> {/* <=== NOU */}

          <Route element={<RoleRoute allow={["ADMIN"]} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/devices" element={<DevicesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
