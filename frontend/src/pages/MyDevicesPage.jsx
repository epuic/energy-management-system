import { useEffect, useState } from "react";
import { listDevicesForUserApi } from "../api/deviceApi";
import { getMeApi } from "../api/userMgmtApi";
import "../styles/devices.css";

export default function MyDevicesPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [me, setMe] = useState(null);
  const [devices, setDevices] = useState([]);

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
    <div className="devices-page">
      <div className="devices-header">
        <h1>My Devices</h1>
        <button onClick={load}>Refresh</button>
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
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    Nu ai device-uri asignate.
                  </td>
                </tr>
              ) : (
                devices.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.maximumConsumption ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {me && (
            <div style={{ padding: "10px 2px", color: "#555" }}>
              <small>User: <strong>{me.username}</strong> (#{me.id})</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
