function getStatus(reading, alerts = []) {
  const alert = alerts.find(
    (item) =>
      item.sensorId === reading.sensorId &&
      item.recordedAt === reading.recordedAt
  );

  return alert ? "warning" : "safe";
}


function formatTime(dateString) {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}


function LogsTable({
  readings = [],
  alerts = [],
}) {

  return (

    <div className="logs-table-wrapper">

      <table className="logs-table">

        <thead>

          <tr>
            <th>TIME</th>
            <th>PH</th>
            <th>TEMP</th>
            <th>TURBIDITY</th>
            <th>STATUS</th>
          </tr>

        </thead>


        <tbody>

          {readings.map((reading) => {

            const status =
              getStatus(
                reading,
                alerts
              );

            return (

              <tr key={reading.id}>

                <td>
                  {formatTime(
                    reading.recordedAt
                  )}
                </td>

                <td>
                  {reading.ph}
                </td>

                <td>
                  {reading.temperature}°C
                </td>

                <td>
                  {reading.turbidity} NTU
                </td>

                <td>

                  <span
                    className={
                      `status-dot ${status}`
                    }
                  />

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );
}

export default LogsTable;