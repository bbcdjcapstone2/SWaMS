
function Alerts({ alerts = [] }) {
  return (
    <div className="alert-list">
      {alerts.length === 0 ? (
        <div className="no-alerts">
          <div className="no-alerts-main">
            SAFE
          </div>

          <div className="no-alerts-subtitle">
            No configured threshold violations detected
          </div>
        </div>
      ) : (
        alerts.map((alert) => {
          const severity =
            alert.severity === "danger"
              ? "danger"
              : "warning";

          return (
            <div
              className={`alert-item alert-${severity}`}
              key={alert.id}
            >
              <div className="alert-item-header">
                <span className="alert-parameter">
                  {alert.parameter}
                </span>

                <span className="alert-value">
                  {alert.value}
                </span>
              </div>

              <p className="alert-message">
                {alert.message}
              </p>

              <div className="alert-time">
                {alert.recordedAt &&
                !Number.isNaN(
                  new Date(alert.recordedAt).getTime()
                )
                  ? new Date(
                      alert.recordedAt
                    ).toLocaleString()
                  : "Time unavailable"}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Alerts;
