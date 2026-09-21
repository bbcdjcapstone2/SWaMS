import { useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TrendChart from "../components/TrendChart";
import LogsTable from "../components/LogsTable";
import Alerts from "../components/Alerts";
import DateFilter from "../components/DateFilter";

import {
  readings,
  alerts,
} from "../data/dummyData";


function Analytics() {

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");


  const filteredReadings =
    useMemo(() => {

      return readings.filter(
        (reading) => {

          const date =
            new Date(
              reading.recordedAt
            );

          if (
            startDate &&
            date < 
              new Date(
                `${startDate}T00:00:00`
              )
          ) {
            return false;
          }

          if (
            endDate &&
            date >
              new Date(
                `${endDate}T23:59:59`
              )
          ) {
            return false;
          }

          return true;
        }
      );

    }, [startDate, endDate]);


  const filteredAlerts =
    useMemo(() => {

      return alerts.filter(
        (alert) => {

          const date =
            new Date(
              alert.recordedAt
            );

          if (
            startDate &&
            date < 
              new Date(
                `${startDate}T00:00:00`
              )
          ) {
            return false;
          }

          if (
            endDate &&
            date >
              new Date(
                `${endDate}T23:59:59`
              )
          ) {
            return false;
          }

          return true;
        }
      );

    }, [startDate, endDate]);


  return (

    <div className="app">

      <Sidebar />

      <main className="dashboard-main">

        <Header analytics />


        <div className="analytics-header">

          <div />

          {/* DATE FILTER ONLY HERE */}

          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

        </div>


        <section className="analytics-grid">


          {/* PH */}

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


          {/* TEMPERATURE */}

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


          {/* TURBIDITY */}

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


          {/* LOGS */}

          <div className="analytics-logs">

            <div className="panel-header">

              <h2 className="panel-title">
                LOGS
              </h2>

            </div>

            <LogsTable
              readings={filteredReadings}
              alerts={filteredAlerts}
            />

          </div>


          {/* ALERTS */}

          <div className="analytics-alerts">

            <div className="panel-header">

              <h2 className="panel-title">
                ALERTS
              </h2>

            </div>

            <Alerts
              alerts={filteredAlerts}
            />

          </div>


        </section>

      </main>

    </div>
  );
}

export default Analytics;