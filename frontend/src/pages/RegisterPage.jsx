import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/authApi";
import { createUserWithIdApi } from "../api/userApi";
import "../styles/register.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const r1 = await registerApi(form.username, form.password);
      const { id, username, role } = r1.data;

      await createUserWithIdApi({ id, username, role });

      setMsg("Cont creat. Te poți autentifica acum.");
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch {
      setMsg("Eroare la înregistrare. Reîncearcă.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Înregistrare</h1>
      <form className="register-form" onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onChange}
          autoFocus
        />
        <input
          name="password"
          type="password"
          placeholder="Parolă"
          value={form.password}
          onChange={onChange}
        />
        <button className="register-button" type="submit" disabled={loading}>
          {loading ? "Se creează..." : "Creează cont"}
        </button>
      </form>
      {msg && <p className="register-msg">{msg}</p>}

      <div className="register-back">
        <Link to="/login">← Înapoi la login</Link>
      </div>
    </div>
  );
}
