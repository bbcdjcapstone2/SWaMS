import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBanner from "../components/StatusBanner";
import MetricCard from "../components/MetricCard";
import Alerts from "../components/Alerts";
import LogsTable from "../components/LogsTable";

import {
  readings,
  alerts,
  getLatestReading,
  getSensorStatus,
} from "../data/dummyData";


function LiveStatus() {

  const latestReading =
    getLatestReading();

  const status =
    getSensorStatus(latestReading);


  const latestLogs =
    [...readings]
      .sort(
        (a, b) =>
          new Date(b.recordedAt) -
          new Date(a.recordedAt)
      )
      .slice(0, 5);


  return (

    <div className="app">

      <Sidebar />

      <main className="dashboard-main">

        <Header />


        {/* SAFE */}

        <StatusBanner status={status} />


        {/* SENSOR VALUES */}

        <section className="status-grid">

          <MetricCard
            title="PH"
            value={
              latestReading?.ph ?? "--"
            }
          />

          <MetricCard
            title="TEMPERATURE"
            value={
              latestReading?.temperature ?? "--"
            }
            unit="°C"
          />

          <MetricCard
            title="TURBIDITY"
            value={
              latestReading?.turbidity ?? "--"
            }
            unit="NTU"
          />

        </section>


        {/* ALERTS + LOGS */}

        <section className="monitoring-panel">

          <Alerts
            alerts={[]}
          />

          <LogsTable
            readings={latestLogs}
            alerts={alerts}
          />

        </section>

      </main>

    </div>

  );
}

export default LiveStatus;