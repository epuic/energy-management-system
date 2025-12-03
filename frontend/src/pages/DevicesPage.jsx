import { useEffect, useMemo, useState } from "react";
import {
  listDevicesApi,
  createDeviceApi,
  updateDeviceApi,
  deleteDeviceApi,
  listUsersApi,
} from "../api/deviceApi";
import "../styles/devices.css";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]); // pentru select user
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal/form
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [form, setForm] = useState({
    id: null,
    name: "",
    maximumConsumption: "",
    userId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(() => (mode === "add" ? "Add device" : "Edit device"), [mode]);

  const loadAll = async () => {
    setLoading(true);
    setErr("");
    try {
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

    // normalizări
    const payload = {
      name: String(form.name).trim(),
      maximumConsumption:
        form.maximumConsumption === "" ? null : Number(form.maximumConsumption),
      userId: form.userId === "" ? null : Number(form.userId),
    };

    try {
      if (mode === "add") {
        await createDeviceApi(payload);
      } else {
        await updateDeviceApi(form.id, payload);
      }
      setIsOpen(false);
      await loadAll();
    } catch {
      setErr(mode === "add" ? "Eroare la creare device." : "Eroare la actualizare device.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (d) => {
    if (!window.confirm(`Ștergi device-ul "${d.name}"?`)) return;
    setErr("");
    try {
      await deleteDeviceApi(d.id);
      await loadAll();
    } catch {
      setErr("Eroare la ștergere device.");
    }
  };

  return (
    <div className="devices-page">
      <div className="devices-header">
        <h1>Devices</h1>
        <button onClick={openAdd}>+ Add device</button>
      </div>

      {err && <div className="devices-error">{err}</div>}

      {loading ? (
        <div className="devices-loading">Se încarcă...</div>
      ) : (
        <div className="devices-table-wrapper">
          <table className="devices-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Max Consumption</th>
                <th>Assigned User</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>Nu există device-uri.</td>
                </tr>
              ) : (
                devices.map((d) => {
                  const u = users.find((x) => x.id === d.userId);
                  return (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.name}</td>
                      <td>{d.maximumConsumption ?? "-"}</td>
                      <td>
                        {d.userId ? (
                          <span className="user-chip">
                            {u ? `${u.username} (#${u.id})` : `User #${d.userId}`}
                          </span>
                        ) : <em>—</em>}
                      </td>
                      <td className="devices-actions">
                        <button onClick={() => openEdit(d)}>Edit</button>
                        <button className="danger" onClick={() => onDelete(d)}>Delete</button>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="icon" onClick={() => !submitting && setIsOpen(false)}>&times;</button>
            </div>

            <form className="modal-form" onSubmit={onSubmit}>
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="ex: Boiler, AC living, etc."
                  required
                />
              </label>

              <label>
                Maximum consumption (kWh)
                <input
                  name="maximumConsumption"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.maximumConsumption}
                  onChange={onChange}
                  placeholder="ex: 2.5"
                />
              </label>

              <label>
                Assigned user (opțional)
                <select name="userId" value={form.userId} onChange={onChange}>
                  <option value="">— neasignat —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} (#{u.id})
                    </option>
                  ))}
                </select>
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
