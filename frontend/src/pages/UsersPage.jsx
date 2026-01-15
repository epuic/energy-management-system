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
import "../styles/table-pages.css"; // Stiluri comune pentru tabele

const ROLES = ["ADMIN", "CLIENT"];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState({ id: null, username: "", role: "CLIENT", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => (mode === "add" ? "Adaugă Utilizator Nou" : `Editează Utilizator ${form.username}`), [mode, form.username]);

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
        const pwd = (form.password || "").trim();
        if (!pwd) {
          setErr("Parola este obligatorie la creare.");
          return;
        }

        const r1 = await createUserInUserDbApi({ username: form.username.trim(), role: form.role });
        const created = r1.data;

        try {
          await createUserInAuthDbWithIdApi({
            id: created.id,
            username: created.username,
            password: pwd,
            role: created.role,
          });
        } catch (e2) {
          // Rollback user-db
          try { await deleteUserInUserDbApi(created.id); } catch (e) { console.error("Rollback failed:", e); }
          setErr(e2?.response?.status === 409 || e2?.response?.status === 400
            ? "Username există deja. Alege alt username."
            : "Eroare la sincronizare în auth. Încearcă din nou."
          );
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
          setErr(e2?.response?.status === 409 || e2?.response?.status === 400
            ? "Username există deja în auth. Alege alt username."
            : "Eroare la actualizare în auth."
          );
          return;
        }
      }

      setIsOpen(false);
      await load();
    } catch (e) {
      setErr(e?.response?.status === 409 || e?.response?.status === 400
        ? "Username există deja în user-db."
        : (mode === "add" ? "Eroare la creare user." : "Eroare la actualizare user.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (u) => {
    if (!window.confirm(`Ești sigur că vrei să ștergi utilizatorul "${u.username}" (#${u.id})?`)) return;
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
    <div className="data-page-container">
      <header className="data-page-header">
        <h1>Administrare Utilizatori</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus-circle"></i> Adaugă Utilizator
        </button>
      </header>

      {err && <div className="alert-error">{err}</div>}

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-sync-alt fa-spin"></i> Se încarcă...
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-id">ID</th>
                <th>Username</th>
                <th>Rol</th>
                <th className="th-actions">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>Nu există utilizatori înregistrați.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="td-id">{u.id}</td>
                    <td className="td-username">{u.username}</td>
                    <td>
                      <span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td className="td-actions">
                      <button className="btn btn-icon btn-edit" onClick={() => openEdit(u)} title="Editează">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-icon btn-danger" onClick={() => onDelete(u)} title="Șterge">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isOpen && (
        <div className="modal-backdrop" onClick={() => !submitting && setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="btn-icon btn-close" onClick={() => !submitting && setIsOpen(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={onSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  placeholder="Introdu username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rol</label>
                <select name="role" value={form.role} onChange={onChange}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Parolă {mode === "add" ? " (obligatoriu)" : " (lasă gol pentru a păstra)"}</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder={mode === "add" ? "Setează o parolă" : "Noua parolă (opțional)"}
                  required={mode === "add"}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => !submitting && setIsOpen(false)}>
                  Anulează
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <><i className="fas fa-spinner fa-spin"></i> Salvare...</> : <><i className="fas fa-save"></i> Salvează</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}