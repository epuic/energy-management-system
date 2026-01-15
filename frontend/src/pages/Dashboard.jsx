import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="ems-dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Energy Management System</h1>
        <div className="user-profile">
          <span className="user-name">Salut, {user?.username}!</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content-area">
        <div className="welcome-card">
          <h2 className="welcome-title">Panoul de Control Principal</h2>
          <p className="user-role-display">
            Rol: <span className={`role-badge role-${user?.roles?.[0]?.toLowerCase() || "client"}`}>{user?.roles?.join(", ") || "CLIENT"}</span>
          </p>
        </div>

        <section className="dashboard-feature-section">
          <h3>🚀 Funcționalități Disponibile</h3>
          <ul className="feature-list">
            <li>Vizualizare și gestionare device-uri personale (Client)</li>
            <li>Administrare utilizatori și device-uri (ADMIN)</li>
            <li>Statistici consum energie și rapoarte</li>
          </ul>
        </section>
      </main>
    </div>
  );
}