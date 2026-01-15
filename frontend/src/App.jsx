import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import RoleRoute from "./routes/RoleRoute";
import UsersPage from "./pages/UsersPage";
import DevicesPage from "./pages/DevicesPage";
import MyDevicesPage from "./pages/MyDevicesPage";
import DeviceConsumptionPage from "./pages/DeviceConsumptionPage";
import Layout from "./components/Layout"; // Acesta va randa ChatComponent acum
import "./styles/app.css";

export default function App() {
  return (
    <Routes>
      {/* Rute accesibile doar dacă NU ești logat */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rute accesibile doar dacă EȘTI logat */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          {/* ChatComponent apare aici prin Layout */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-devices" element={<MyDevicesPage />} />
          <Route
            path="/my-devices/:deviceId/consumption"
            element={<DeviceConsumptionPage />}
          />

          {/* Rute doar pentru ADMIN */}
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