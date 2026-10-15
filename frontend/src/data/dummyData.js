
 // ============================================================
 // SENSOR INFORMATION
 // ============================================================

export const sensorInfo = {
  name: "Water Quality Sensor",
  location: "Monitoring Station",
  sensorId: "WQM-001",
};


// ============================================================
// STORED SENSOR READINGS
// ============================================================
// Temporary frontend readings for testing.
// Actual readings are fetched from the backend by the pages.

export const readings = [
  {
    id: 1,
    sensorId: "WQM-001",
    recordedAt: "2026-09-18T08:00:00",
    ph: 6.2,
    temperature: 26,
    turbidity: 40,
  },
  {
    id: 2,
    sensorId: "WQM-001",
    recordedAt: "2026-09-18T10:00:00",
    ph: 6.5,
    temperature: 27,
    turbidity: 90,
  },
  {
    id: 3,
    sensorId: "WQM-001",
    recordedAt: "2026-09-18T12:00:00",
    ph: 6.4,
    temperature: 27,
    turbidity: 65,
  },
  {
    id: 4,
    sensorId: "WQM-001",
    recordedAt: "2026-09-18T14:00:00",
    ph: 6.5,
    temperature: 27,
    turbidity: 50,
  },
  {
    id: 5,
    sensorId: "WQM-001",
    recordedAt: "2026-09-17T08:00:00",
    ph: 6.4,
    temperature: 26,
    turbidity: 45,
  },
  {
    id: 6,
    sensorId: "WQM-001",
    recordedAt: "2026-09-17T10:00:00",
    ph: 6.6,
    temperature: 27,
    turbidity: 55,
  },
  {
    id: 7,
    sensorId: "WQM-001",
    recordedAt: "2026-09-17T14:00:00",
    ph: 6.7,
    temperature: 28,
    turbidity: 60,
  },
  {
    id: 8,
    sensorId: "WQM-001",
    recordedAt: "2026-09-16T09:00:00",
    ph: 6.3,
    temperature: 26,
    turbidity: 35,
  },
  {
    id: 9,
    sensorId: "WQM-001",
    recordedAt: "2026-09-16T12:00:00",
    ph: 6.5,
    temperature: 27,
    turbidity: 48,
  },
  {
    id: 10,
    sensorId: "WQM-001",
    recordedAt: "2026-09-16T15:00:00",
    ph: 6.6,
    temperature: 27,
    turbidity: 52,
  },
];


// ============================================================
// STORED ALERTS
// ============================================================
// These are sample alerts for frontend testing only.
// Actual alerts should be derived from backend readings.

export const alerts = [
  {
    id: 1,
    sensorId: "WQM-001",
    recordedAt: "2026-09-18T10:00:00",
    parameter: "Turbidity",
    value: 90,
    message: "Sample alert for frontend testing.",
    severity: "warning",
  },
];


// ============================================================
// GET LATEST READING
// ============================================================

export const getLatestReading = () => {
  if (!Array.isArray(readings) || readings.length === 0) {
    return null;
  }

  return [...readings].sort(
    (a, b) =>
      new Date(b.recordedAt ?? b.created_at).getTime() -
      new Date(a.recordedAt ?? a.created_at).getTime()
  )[0];
};


// ============================================================
// GET SENSOR STATUS
// ============================================================
// Evaluates the actual reading against the thresholds
// stated in the capstone paper.
//
// pH: 6.5–8.5
// Temperature: 24–32 °C
// Turbidity: 50–100 NTU is the range stated in Process 2.3,
// but the lower-bound interpretation needs confirmation.
// Values above 100 NTU are flagged.

export const getSensorStatus = (reading) => {
  if (!reading) {
    return "NO DATA";
  }

  const ph = Number(reading.ph);
  const temperature = Number(reading.temperature);
  const turbidity = Number(reading.turbidity);

  // Missing or invalid values must not be marked safe.
  if (
    reading.ph == null ||
    reading.temperature == null ||
    reading.turbidity == null ||
    !Number.isFinite(ph) ||
    !Number.isFinite(temperature) ||
    !Number.isFinite(turbidity)
  ) {
    return "NOT EVALUATED";
  }

  // Check pH threshold.
  if (ph < 6.5 || ph > 8.5) {
    return "WARNING";
  }

  // Check temperature threshold.
  if (temperature < 24 || temperature > 32) {
    return "WARNING";
  }

  // Turbidity above the stated upper limit.
  if (turbidity > 100) {
    return "WARNING";
  }

  // Lower turbidity limit needs confirmation.
  if (turbidity < 50) {
    return "REVIEW";
  }

  return "SAFE";
};


// ============================================================
// GET READINGS BY DATE
// ============================================================

export const getReadingsByDate = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return readings;
  }

  return readings.filter((reading) => {
    const recordedAt = reading.recordedAt ?? reading.created_at;
    const readingDate = new Date(recordedAt);

    const start = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;

    const end = endDate
      ? new Date(`${endDate}T23:59:59.999`)
      : null;

    if (start && readingDate < start) {
      return false;
    }

    if (end && readingDate > end) {
      return false;
    }

    return true;
  });
};


// ============================================================
// GET ALERTS BY DATE
// ============================================================

export const getAlertsByDate = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return alerts;
  }

  return alerts.filter((alert) => {
    const alertDate = new Date(alert.recordedAt);

    const start = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;

    const end = endDate
      ? new Date(`${endDate}T23:59:59.999`)
      : null;

    if (start && alertDate < start) {
      return false;
    }

    if (end && alertDate > end) {
      return false;
    }

    return true;
  });
};


// ============================================================
// GET LATEST READINGS
// ============================================================

export const getLatestReadings = (limit = 5) => {
  return [...readings]
    .sort(
      (a, b) =>
        new Date(b.recordedAt ?? b.created_at).getTime() -
        new Date(a.recordedAt ?? a.created_at).getTime()
    )
    .slice(0, limit);
};
