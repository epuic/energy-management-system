import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getHourlyConsumptionApi } from "../api/monitoringApi";
import { getDeviceApi } from "../api/deviceApi";
import "../styles/table-pages.css";

// Adăugați aceste importuri (necesită npm install react-chartjs-2 chart.js)
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Inregistram componentele Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DeviceConsumptionPage() {
    const { deviceId } = useParams();
    const [consumptionData, setConsumptionData] = useState([]);
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    // Seteaza data initiala la data curenta in format YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const loadData = async (date) => {
        setLoading(true);
        setErr("");
        try {
            // Ruleaza ambele apeluri in paralel
            const [dataRes, deviceRes] = await Promise.all([
                getHourlyConsumptionApi(deviceId, date),
                getDeviceApi(deviceId)
            ]);
            setConsumptionData(dataRes.data || []);
            setDevice(deviceRes.data);
        } catch (e) {
            setErr("Eroare la încărcarea datelor de consum sau a detaliilor device-ului.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Asigură-te că deviceId este un număr valid înainte de a încărca
        if (deviceId) {
            loadData(selectedDate);
        }
    }, [deviceId, selectedDate]);


    // Procesează datele pentru Chart.js
    const chartData = useMemo(() => {
        // Creează o hartă de la ora (HH) la consum (kWh)
        const hourlyMap = consumptionData.reduce((acc, item) => {
            const hour = new Date(item.timestampHour).getHours();
            // Asigură-te că ora are două cifre (ex: '09')
            const hourKey = String(hour).padStart(2, '0');
            acc[hourKey] = item.energyConsumedKWh;
            return acc;
        }, {});

        // Generează toate etichetele orare de la 00 la 23
        const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

        // Populează setul de date
        const data = labels.map((label, index) => {
            const hourKey = String(index).padStart(2, '0');
            return hourlyMap[hourKey] || 0; // Folosește 0 dacă nu există consum
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Consum Orar (kWh)',
                    data: data,
                    backgroundColor: 'rgba(30, 144, 255, 0.8)', // var(--color-primary)
                    borderColor: 'rgba(30, 144, 255, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }, [consumptionData]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Consum de Energie pe Ore (kWh)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Energie (kWh)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Ora Zilei',
                },
            },
        },
    };

    return (
        <div className="data-page-container">
            <header className="data-page-header">
                <h1>Consum pentru Device: {device ? device.name : `ID ${deviceId}`}</h1>
                <div className="controls">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="form-control"
                    />
                    <button className="btn btn-secondary" onClick={() => loadData(selectedDate)} disabled={loading}>
                        <i className="fas fa-search"></i> Caută
                    </button>
                </div>
            </header>

            {err && <div className="alert-error">{err}</div>}

            {loading ? (
                <div className="loading-state">
                    <i className="fas fa-sync-alt fa-spin"></i> Se încarcă datele...
                </div>
            ) : (
                <div className="table-wrapper" style={{ padding: '20px' }}>
                    {consumptionData.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '50px' }}>
                            Nu există date de consum pentru {device?.name} la data de {selectedDate}.
                        </p>
                    ) : (
                        // Componenta Bar din react-chartjs-2
                        <Bar options={options} data={chartData} />
                    )}
                </div>
            )}
            <div className="table-footer-info" style={{ marginTop: '20px' }}>
                <p>Consumul total raportat pentru data de {selectedDate}:
                <strong> {consumptionData.reduce((acc, item) => acc + item.energyConsumedKWh, 0).toFixed(3)} kWh</strong>
                </p>
            </div>
        </div>
    );
}