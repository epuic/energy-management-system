import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

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
      setError("User sau parolă incorecte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Autentificare</h1>
      <form className="login-form" onSubmit={onSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={onChange} />
        <input name="password" type="password" placeholder="Parolă" value={form.password} onChange={onChange} />
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Se conectează..." : "Login"}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>

      <div className="login-register-link">
        <span>Nu ai cont?</span>
        <Link to="/register">Înregistrează-te</Link>
      </div>
    </div>
  );
}
