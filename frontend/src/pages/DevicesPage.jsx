import { useEffect, useMemo, useState } from "react";
import {
  listDevicesApi,
  createDeviceApi,
  updateDeviceApi,
  deleteDeviceApi,
  listUsersApi,
} from "../api/deviceApi";
import "../styles/table-pages.css"; // Stiluri comune pentru tabele

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal/form
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState({
    id: null,
    name: "",
    maximumConsumption: "",
    userId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => (mode === "add" ? "Adaugă Device Nou" : `Editează Device ${form.name}`), [mode, form.name]);

  const loadAll = async () => {
    setLoading(true);
    setErr("");
    try {
      // Rulează ambele apeluri în paralel
      const [dres, ures] = await Promise.all([listDevicesApi(), listUsersApi()]);
      setDevices(dres.data || []);
      setUsers(ures.data || []);
    } catch {
      setErr("Nu am putut încărca device-urile sau lista de utilizatori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const openAdd = () => {
    setMode("add");
    setForm({ id: null, name: "", maximumConsumption: "", userId: "" });
    setIsOpen(true);
  };

  const openEdit = (d) => {
    setMode("edit");
    setForm({
      id: d.id,
      name: d.name ?? "",
      maximumConsumption: d.maximumConsumption ?? "",
      userId: d.userId ?? "",
    });
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

    const selectedUser = users.find(u => u.id === Number(form.userId));

    const payload = {
      name: String(form.name).trim(),
      maximumConsumption:
        form.maximumConsumption === "" ? null : Number(form.maximumConsumption),
      userId: form.userId === "" ? null : Number(form.userId),
      username: selectedUser ? selectedUser.username : null
    };

    try {
      if (mode === "add") {
        await createDeviceApi(payload);
      } else {
        await updateDeviceApi(form.id, payload);
      }
      setIsOpen(false);
      await loadAll();
    } catch (e) {
      setErr(mode === "add" ? "Eroare la creare device." : "Eroare la actualizare device.");
      console.error("Eroare API:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (d) => {
    if (!window.confirm(`Ești sigur că ștergi device-ul "${d.name}" (#${d.id})?`)) return;
    setErr("");
    try {
      await deleteDeviceApi(d.id);
      await loadAll();
    } catch {
      setErr("Eroare la ștergere device.");
    }
  };

  return (
    <div className="data-page-container">
      <header className="data-page-header">
        <h1>Administrare Device-uri</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <i className="fas fa-plus-circle"></i> Adaugă Device
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
                <th>Nume Device</th>
                <th>Consum Maxim (kWh)</th>
                <th>Utilizator Asignat</th>
                <th className="th-actions">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>Nu există device-uri înregistrate.</td>
                </tr>
              ) : (
                devices.map((d) => {
                  const u = users.find((x) => x.id === d.userId);
                  return (
                    <tr key={d.id}>
                      <td className="td-id">{d.id}</td>
                      <td>{d.name}</td>
                      <td className="td-consumption">{d.maximumConsumption ? `${d.maximumConsumption} kWh` : "-"}</td>
                      <td>
                        {d.userId ? (
                          <span className="user-assignment-chip">
                            <i className="fas fa-user-tag"></i> {u ? `${u.username} (#${u.id})` : `User #${d.userId}`}
                          </span>
                        ) : <em>— Neasignat —</em>}
                      </td>
                      <td className="td-actions">
                        <button className="btn btn-icon btn-edit" onClick={() => openEdit(d)} title="Editează">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => onDelete(d)} title="Șterge">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
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
                <label>Nume Device</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="ex: Boiler, AC living, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label>Consum Maxim (kWh)</label>
                <input
                  name="maximumConsumption"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.maximumConsumption}
                  onChange={onChange}
                  placeholder="ex: 2.5"
                />
              </div>

              <div className="form-group">
                <label>Utilizator Asignat (opțional)</label>
                <select name="userId" value={form.userId} onChange={onChange}>
                  <option value="">— neasignat —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} (#{u.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => !submitting && setIsOpen(false)}>Anulează</button>
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