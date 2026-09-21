function MetricCard({
  title,
  value,
  unit,
}) {
  return (
    <div className="status-card">

      <div className="status-card-title">
        {title}
      </div>

      <div className="status-card-value">
        {value}

        {unit && (
          <span className="status-card-unit">
            {unit}
          </span>
        )}
      </div>

    </div>
  );
}

export default MetricCard;