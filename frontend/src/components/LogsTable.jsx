
function LogsTable({ readings = [] }) {
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
          {readings.map((reading, index) => (
            <tr key={reading.id ?? index}>
              <td>
                {reading.recordedAt
                  ? new Date(
                      reading.recordedAt
                    ).toLocaleString()
                  : "--"}
              </td>

              <td>
                {reading.ph == null ? "--" : reading.ph}
              </td>

              <td>
                {reading.temperature == null
                  ? "--"
                  : `${reading.temperature}°C`}
              </td>

              <td>
                {reading.turbidity == null
                  ? "--"
                  : `${reading.turbidity} NTU`}
              </td>

              <td>
                {reading.status ?? "REVIEW"}
              </td>
            </tr>
          ))}

          {readings.length === 0 && (
            <tr>
              <td colSpan="5">No logs available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LogsTable;
