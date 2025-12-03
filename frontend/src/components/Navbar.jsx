import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { isLoggedIn, user, hasRole, logout } = useAuth();

  return (
    <nav className="navbar">
      <h3>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Energy Management
        </Link>
      </h3>

      {isLoggedIn && (
        <div className="navbar-right">
          {/* useri */}
          <Link to="/my-devices" className="navbar-link">My Devices</Link>

          {/* ADMIN */}
          {hasRole("ADMIN") && (
            <>
              <Link to="/users" className="navbar-link">Users</Link>
              <Link to="/devices" className="navbar-link">Devices</Link>
            </>
          )}

          <span>{user?.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
