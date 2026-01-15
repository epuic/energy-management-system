import { useEffect, useState } from "react";
import { listDevicesForUserApi } from "../api/deviceApi";
import { getMeApi } from "../api/userMgmtApi";
import "../styles/table-pages.css";
import { useNavigate } from "react-router-dom"; // <-- Import NOU

export default function MyDevicesPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [me, setMe] = useState(null);
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate(); // <-- Instanțiază useNavigate

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const meRes = await getMeApi();
      setMe(meRes.data);

      const dres = await listDevicesForUserApi(meRes.data.id);
      setDevices(Array.isArray(dres.data) ? dres.data : []);
    } catch (e) {
      console.error(e);
      setErr("Nu am putut încărca device-urile tale.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="data-page-container">
      <header className="data-page-header">
        <h1>Dispozitivele Mele</h1>
        <button className="btn btn-secondary" onClick={load}>
          <i className="fas fa-redo-alt"></i> Reîmprospătează
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
                <th>Stare</th>
                <th className="th-actions">Vizualizare</th> {/* <-- Coloană NOUĂ */}
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nu ai device-uri asignate.
                  </td>
                </tr>
              ) : (
                devices.map((d) => (
                  <tr key={d.id}>
                    <td className="td-id">{d.id}</td>
                    <td>{d.name}</td>
                    <td className="td-consumption">{d.maximumConsumption ? `${d.maximumConsumption} kWh` : "-"}</td>
                    <td className="td-status">
                       <span className="status-indicator status-ok">Activ</span>
                    </td>
                    {/* COLOANA NOUĂ CU BUTON */}
                    <td className="td-actions">
                      <button
                          className="btn btn-icon btn-primary"
                          title="Vezi Consumul Orar"
                          onClick={() => navigate(`/my-devices/${d.id}/consumption`)}
                      >
                          <i className="fas fa-chart-bar"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {me && (
            <div className="table-footer-info">
              <small>Utilizator conectat: <strong>{me.username}</strong> (#{me.id})</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}