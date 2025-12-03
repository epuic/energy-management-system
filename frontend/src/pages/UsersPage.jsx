import { useEffect, useMemo, useState } from "react";
import {
  listUsersApi,
  createUserInUserDbApi,
  createUserInAuthDbWithIdApi,
  updateUserInUserDbApi,
  updateUserInAuthDbApi,
  deleteUserInUserDbApi,
  deleteUserInAuthDbApi,
} from "../api/userMgmtApi";
import "../styles/users.css";

const ROLES = ["ADMIN", "CLIENT"];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState({ id: null, username: "", role: "CLIENT", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => (mode === "add" ? "Add user" : "Edit user"), [mode]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await listUsersApi();
      setUsers(res.data || []);
    } catch (e) {
      setErr("Nu am putut încărca lista de utilizatori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setMode("add");
    setForm({ id: null, username: "", role: "CLIENT", password: "" });
    setIsOpen(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setForm({ id: u.id, username: u.username, role: u.role, password: "" });
    setIsOpen(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr("");

    try {
      if (mode === "add") {
        const r1 = await createUserInUserDbApi({ username: form.username.trim(), role: form.role });
        const created = r1.data;

        try {
          await createUserInAuthDbWithIdApi({
            id: created.id,
            username: created.username,
            password: (form.password || "").trim(),
            role: created.role,
          });
        } catch (e2) {
          try { await deleteUserInUserDbApi(created.id); } catch {}
          if (e2?.response?.status === 409 || e2?.response?.status === 400) {
            setErr("Username există deja în auth. Alege alt username.");
          } else {
            setErr("Eroare la sincronizare în auth. Încearcă din nou.");
          }
          return;
        }

      } else {
        const core = { username: form.username.trim(), role: form.role };

        await updateUserInUserDbApi(form.id, core);

        const authPayload = { ...core };
        const pwd = (form.password || "").trim();
        if (pwd) authPayload.password = pwd;

        try {
          await updateUserInAuthDbApi(form.id, authPayload);
        } catch (e2) {
          if (e2?.response?.status === 409 || e2?.response?.status === 400) {
            setErr("Username există deja în auth. Alege alt username.");
          } else {
            setErr("Eroare la actualizare în auth.");
          }
          return;
        }
      }

      setIsOpen(false);
      await load();
    } catch (e) {
      if (e?.response?.status === 409 || e?.response?.status === 400) {
        setErr("Username există deja în user-db.");
      } else {
        setErr(mode === "add" ? "Eroare la creare user." : "Eroare la actualizare user.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (u) => {
    if (!window.confirm(`Ștergi utilizatorul "${u.username}"?`)) return;
    setErr("");
    try {
      await deleteUserInAuthDbApi(u.id);
      await deleteUserInUserDbApi(u.id);
      await load();
    } catch (e) {
      setErr("Eroare la ștergere. Verifică conexiunile către ambele servicii.");
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Users</h1>
        <button onClick={openAdd}>+ Add user</button>
      </div>

      {err && <div className="users-error">{err}</div>}

      {loading ? (
        <div className="users-loading">Se încarcă...</div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>Nu există utilizatori.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>
                      <span className={`badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td className="users-actions">
                      <button onClick={() => openEdit(u)}>Edit</button>
                      <button className="danger" onClick={() => onDelete(u)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <div className="modal-backdrop" onClick={() => !submitting && setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="icon" onClick={() => !submitting && setIsOpen(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={onSubmit}>
              <label>
                Username
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  placeholder="username"
                  required
                />
              </label>

              <label>
                Role
                <select name="role" value={form.role} onChange={onChange}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>

              <label>
                Password {mode === "add" ? "(obligatoriu)" : "(lasă gol pentru a păstra)"}
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder={mode === "add" ? "setează o parolă" : "noua parolă (opțional)"}
                  required={mode === "add"}
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => !submitting && setIsOpen(false)}>Cancel</button>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Se salvează..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
