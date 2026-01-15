import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css"; // Am combinat login/register in auth.css

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/", { replace: true });
    } catch {
      setError("User sau parolă incorecte. Reîncearcă.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Autentificare</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Introdu username"
              value={form.username}
              onChange={onChange}
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Introdu parola"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          {error && <p className="alert-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
            {loading ? " Se conectează..." : " Login"}
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Nu ai cont?</span>
          <Link to="/register" className="footer-link">Înregistrează-te acum</Link>
        </div>
      </div>
    </div>
  );
}