import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/authApi";
import { createUserWithIdApi } from "../api/userApi";
import "../styles/auth.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    try {
      const r1 = await registerApi(form.username, form.password);
      const { id, username, role } = r1.data;

      await createUserWithIdApi({ id, username, role });

      setMsg("Cont creat cu succes! Te redirecționăm la pagina de login.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Eroare la înregistrare. Asigură-te că username-ul nu este deja folosit.";
      setErr(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Înregistrare Cont Nou</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Alege un username"
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
              placeholder="Creează o parolă"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          {err && <p className="alert-error">{err}</p>}
          {msg && <p className="alert-success">{msg}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-plus"></i>}
            {loading ? " Se creează..." : " Creează cont"}
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/login" className="footer-link">← Înapoi la autentificare</Link>
        </div>
      </div>
    </div>
  );
}