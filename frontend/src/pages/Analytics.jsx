
import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TrendChart from "../components/TrendChart";
import LogsTable from "../components/LogsTable";
import Alerts from "../components/Alerts";
import DateFilter from "../components/DateFilter";

const API_URL = "http://localhost:3000/api/readings?limit=1000";

// Convert a reading timestamp into YYYY-MM-DD.
// Handles both SQLite timestamps and ISO timestamps.
function getCalendarDate(timestamp) {
  if (!timestamp) return "";

  const value = String(timestamp);

  // SQLite timestamps may use "YYYY-MM-DD HH:mm:ss".
  // Use the date portion to avoid timezone shifting.
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Determine whether a record falls within the selected date range.
function isWithinDateRange(timestamp, startDate, endDate) {
  const recordDate = getCalendarDate(timestamp);

  if (!recordDate) return false;
  if (startDate && recordDate < startDate) return false;
  if (endDate && recordDate > endDate) return false;

  return true;
}

function Analytics() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchReadings() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load readings.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("The backend returned an unexpected response.");
        }

        if (!active) return;

        const normalizedReadings = data.map((reading) => ({
          ...reading,
          recordedAt:
            reading.recordedAt ??
            reading.created_at ??
            reading.recorded_at,
        }));

        setReadings(normalizedReadings);

        // Generate alerts from actual backend readings.
        // Adjust these limits to your project's approved criteria.
        const generatedAlerts = [];

        normalizedReadings.forEach((reading) => {
          const recordedAt = reading.recordedAt;

          const parameters = [
            {
              key: "ph",
              label: "pH",
              value: Number(reading.ph),
              warning: (value) =>
                (value >= 6.5 && value < 6.8) ||
                (value > 8.2 && value <= 8.5),
              danger: (value) => value < 6.5 || value > 8.5,
            },
            {
              key: "temperature",
              label: "Temperature",
              value: Number(reading.temperature),
              warning: (value) =>
                (value >= 30 && value < 35),
              danger: (value) => value >= 35,
            },
            {
              key: "turbidity",
              label: "Turbidity",
              value: Number(reading.turbidity),
              warning: (value) =>
                value >= 4 && value <= 5,
              danger: (value) => value > 5,
            },
          ];

          parameters.forEach((parameter) => {
            if (!Number.isFinite(parameter.value)) return;

            let severity = "";

            if (parameter.danger(parameter.value)) {
              severity = "danger";
            } else if (parameter.warning(parameter.value)) {
              severity = "warning";
            }

            if (!severity) return;

            generatedAlerts.push({
              id: `${reading.id ?? recordedAt}-${parameter.key}`,
              sensorId: reading.sensorId ?? reading.sensor_id ?? "WQM-001",
              recordedAt,
              parameter: parameter.label,
              value: parameter.value,
              severity,
              message:
                severity === "danger"
                  ? `${parameter.label} is outside the configured limits.`
                  : `${parameter.label} is approaching a configured limit.`,
            });
          });
        });

        setAlerts(generatedAlerts);
        setError("");
      } catch (err) {
        if (active) {
          setError(
            "Unable to load analytics. Check that the backend is running and the readings endpoint is working."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchReadings();

    // Refresh saved readings from the backend every 10 seconds.
    const intervalId = setInterval(fetchReadings, 10000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  // All three graphs and the logs use this same filtered array.
  const filteredReadings = useMemo(() => {
    return readings.filter((reading) =>
      isWithinDateRange(
        reading.recordedAt,
        startDate,
        endDate
      )
    );
  }, [readings, startDate, endDate]);

  // Alerts follow the same selected date range.
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) =>
      isWithinDateRange(
        alert.recordedAt,
        startDate,
        endDate
      )
    );
  }, [alerts, startDate, endDate]);

  return (
    <div className="app">
      <Sidebar />

      <main className="dashboard-main">
        <Header analytics />

        <div className="analytics-header">
          <div />

          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {loading && <p>Loading analytics...</p>}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <p>
            Showing {filteredReadings.length} reading(s)
            {startDate || endDate
              ? ` for ${startDate || "the beginning"} to ${
                  endDate || "the latest date"
                }`
              : " across all dates"}
            .
          </p>
        )}

        {!loading && !error && filteredReadings.length === 0 && (
          <p>No readings found for the selected date range.</p>
        )}

        <section className="analytics-grid">
          <TrendChart
            readings={filteredReadings}
            parameter="ph"
            label={
              <>
                PH READINGS
                <br />
                TREND
              </>
            }
          />

          <TrendChart
            readings={filteredReadings}
            parameter="temperature"
            label={
              <>
                TEMPERATURE
                <br />
                READINGS
                <br />
                TREND
              </>
            }
          />

          <TrendChart
            readings={filteredReadings}
            parameter="turbidity"
            label={
              <>
                TURBIDITY
                <br />
                READINGS
                <br />
                TREND
              </>
            }
          />

          <div className="analytics-logs">
            <div className="panel-header">
              <h2 className="panel-title">LOGS</h2>
            </div>

            <LogsTable
              readings={filteredReadings}
              alerts={filteredAlerts}
            />
          </div>

          <div className="analytics-alerts">
            <div className="panel-header">
              <h2 className="panel-title">ALERTS</h2>
            </div>

            <Alerts alerts={filteredAlerts} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Analytics;
