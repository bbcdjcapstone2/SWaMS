
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBanner from "../components/StatusBanner";
import MetricCard from "../components/MetricCard";
import Alerts from "../components/Alerts";
import LogsTable from "../components/LogsTable";
import "../styles/liveStatus.css";

const API_URL = "http://localhost:3000/api/readings";

// Returns SAFE, WARNING, DANGER, or NOT EVALUATED.
function getParameterStatus(parameter, value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return "NOT EVALUATED";
  }

  const reading = Number(value);

  if (parameter === "ph") {
    if (reading < 0 || reading > 14) {
      return "NOT EVALUATED";
    }

    if (reading < 6.5 || reading > 8.5) {
      return "DANGER";
    }

    if (reading <= 6.7 || reading >= 8.3) {
      return "WARNING";
    }

    return "SAFE";
  }

  if (parameter === "temperature") {
    if (reading < -50 || reading > 100) {
      return "NOT EVALUATED";
    }

    if (reading < 24 || reading > 32) {
      return "DANGER";
    }

    if (reading <= 25 || reading >= 31) {
      return "WARNING";
    }

    return "SAFE";
  }

  if (parameter === "turbidity") {
    if (reading < 0) {
      return "NOT EVALUATED";
    }

    if (reading < 50 || reading > 100) {
      return "DANGER";
    }

    if (reading <= 55 || reading >= 95) {
      return "WARNING";
    }

    return "SAFE";
  }

  return "NOT EVALUATED";
}

function getOverallStatus(statuses) {
  if (statuses.includes("DANGER")) {
    return "DANGER";
  }

  if (statuses.includes("WARNING")) {
    return "WARNING";
  }

  if (statuses.every((status) => status === "SAFE")) {
    return "SAFE";
  }

  return "NOT EVALUATED";
}

function createAlerts(reading, statuses) {
  if (!reading) {
    return [];
  }

  const alerts = [];
  const recordedAt =
    reading.recordedAt ?? reading.created_at ?? null;

  function addAlert(parameter, value, status, message) {
    alerts.push({
      id: `${parameter.toLowerCase()}-${alerts.length}`,
      parameter,
      value,
      severity: status === "DANGER" ? "danger" : "warning",
      message,
      recordedAt,
    });
  }

  const parameters = [
    {
      key: "ph",
      label: "PH",
      value: Number(reading.ph),
      status: statuses.phStatus,
      unit: "",
    },
    {
      key: "temperature",
      label: "TEMPERATURE",
      value: Number(reading.temperature),
      status: statuses.temperatureStatus,
      unit: "°C",
    },
    {
      key: "turbidity",
      label: "TURBIDITY",
      value: Number(reading.turbidity),
      status: statuses.turbidityStatus,
      unit: " NTU",
    },
  ];

  for (const parameter of parameters) {
    if (parameter.status === "SAFE") {
      continue;
    }

    const displayValue =
      parameter.status === "NOT EVALUATED"
        ? "--"
        : parameter.key === "ph"
          ? parameter.value.toFixed(2)
          : `${parameter.value.toFixed(1)}${parameter.unit}`;

    if (parameter.status === "NOT EVALUATED") {
      addAlert(
        parameter.label,
        displayValue,
        "WARNING",
        "This parameter could not be evaluated. Check the sensor reading."
      );
    } else if (parameter.status === "DANGER") {
      addAlert(
        parameter.label,
        displayValue,
        "DANGER",
        `${parameter.label} is outside its configured range.`
      );
    } else {
      addAlert(
        parameter.label,
        displayValue,
        "WARNING",
        `${parameter.label} is approaching a configured limit.`
      );
    }
  }

  return alerts;
}

function LiveStatus() {
  const [latestReading, setLatestReading] = useState(null);
  const [latestLogs, setLatestLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchReadings() {
      try {
        const response = await fetch(`${API_URL}?limit=5`);

        if (!response.ok) {
          throw new Error("Could not retrieve readings.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid backend response.");
        }

        if (!active) {
          return;
        }

        const normalizedReadings = data.map((reading) => ({
          ...reading,
          recordedAt:
            reading.created_at ?? reading.recordedAt ?? null,
        }));

        setLatestLogs(normalizedReadings);
        setLatestReading(normalizedReadings[0] ?? null);
        setError("");
      } catch {
        if (active) {
          setError(
            "Unable to connect to the backend. Check that it is running."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchReadings();

    const intervalId = setInterval(fetchReadings, 5000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const phStatus = getParameterStatus("ph", latestReading?.ph);
  const temperatureStatus = getParameterStatus(
    "temperature",
    latestReading?.temperature
  );
  const turbidityStatus = getParameterStatus(
    "turbidity",
    latestReading?.turbidity
  );

  const overallStatus = getOverallStatus([
    phStatus,
    temperatureStatus,
    turbidityStatus,
  ]);

  const currentAlerts = latestReading
    ? createAlerts(latestReading, {
        phStatus,
        temperatureStatus,
        turbidityStatus,
      })
    : [];

  return (
    <div className="app">
      <Sidebar />

      <main className="dashboard-main">
        <Header />

        {loading && <p>Loading water-quality readings...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && !latestReading && (
          <p>No readings have been recorded yet.</p>
        )}

        <StatusBanner status={overallStatus} />

        <section className="status-grid">
          <MetricCard
            title="PH"
            value={
              latestReading?.ph == null
                ? "--"
                : Number(latestReading.ph).toFixed(2)
            }
            status={phStatus}
          />

          <MetricCard
            title="TEMPERATURE"
            value={
              latestReading?.temperature == null
                ? "--"
                : Number(latestReading.temperature).toFixed(1)
            }
            unit="°C"
            status={temperatureStatus}
          />

          <MetricCard
            title="TURBIDITY"
            value={
              latestReading?.turbidity == null
                ? "--"
                : Number(latestReading.turbidity).toFixed(1)
            }
            unit="NTU"
            status={turbidityStatus}
          />
        </section>

        <section className="monitoring-panel">
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">ALERTS</h2>
            </div>

            <Alerts alerts={currentAlerts} />
          </div>

          <div className="panel logs-panel">
            <div className="panel-header">
              <h2 className="panel-title">LOGS</h2>
            </div>

            <LogsTable readings={latestLogs} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default LiveStatus;
