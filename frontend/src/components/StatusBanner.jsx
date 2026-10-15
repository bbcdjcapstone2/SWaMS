
function StatusBanner({ status }) {
  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  let statusClass = "unknown-status";
  let displayStatus = "NOT EVALUATED";

  if (normalizedStatus === "SAFE") {
    statusClass = "safe-status";
    displayStatus = "SAFE";
  } else if (normalizedStatus === "WARNING") {
    statusClass = "warning-status";
    displayStatus = "WARNING";
  } else if (normalizedStatus === "DANGER") {
    statusClass = "danger-status";
    displayStatus = "DANGER";
  }

  return (
    <section className="safe-container">
      <div className={`safe-box ${statusClass}`}>
        {displayStatus}
      </div>
    </section>
  );
}

export default StatusBanner;
