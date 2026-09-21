function StatusBanner({ status }) {
  return (

    <section className="safe-container">

      <div
        className={
          `safe-box ${
            status === "WARNING"
              ? "warning-status"
              : ""
          }`
        }
      >
        {status}
      </div>

    </section>

  );
}

export default StatusBanner;