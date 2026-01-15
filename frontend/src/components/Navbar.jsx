import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { isLoggedIn, user, hasRole, logout } = useAuth();

  return (
    <nav className="ems-navbar">
      <h3 className="logo">
        <Link to="/" className="logo-link">
          <i className="fas fa-bolt"></i> EMS
        </Link>
      </h3>

      {isLoggedIn && (
        <div className="navbar-right-content">
          <div className="user-links">
            {/* useri */}
            <Link to="/my-devices" className="nav-link">
              <i className="fas fa-tablet-alt"></i> Dispozitivele Mele
            </Link>

            {/* ADMIN */}
            {hasRole("ADMIN") && (
              <>
                <Link to="/users" className="nav-link">
                  <i className="fas fa-users-cog"></i> Utilizatori
                </Link>
                <Link to="/devices" className="nav-link">
                  <i className="fas fa-cogs"></i> Administrare Device-uri
                </Link>
              </>
            )}
          </div>

          <div className="user-info-chip">
            <i className="fas fa-user-circle"></i> {user?.username}
          </div>

          <button onClick={logout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      )}
    </nav>
  );
}