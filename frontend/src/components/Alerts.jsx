function Alerts({ alerts = [] }) {
  return (
    <div className="alert-list">

      {alerts.length === 0 ? (

        <div className="no-alerts">

          <div className="no-alerts-main">
            NO ALERTS
          </div>

          <div className="no-alerts-subtitle">
            All parameters are safe
          </div>

        </div>

      ) : (

        alerts.map((alert) => (

          <div
            className="alert-item"
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
              {new Date(
                alert.recordedAt
              ).toLocaleString()}
            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default Alerts;
