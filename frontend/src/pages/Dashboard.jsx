import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // redirecționează la login
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Energy Management System</h2>
        <div className="dashboard-user">
          <span>{user?.username}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h3>Bine ai venit, {user?.username}!</h3>
        <p>Rol: {user?.roles?.join(", ") || "CLIENT"}</p>

        <div className="dashboard-actions">
          <p>Aici poți adăuga mai târziu pagini pentru:</p>
          <ul>
            <li>Vizualizare și gestionare device-uri</li>
            <li>Administrare utilizatori (ADMIN)</li>
            <li>Statistici consum energie</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
