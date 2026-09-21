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
// These are temporary frontend readings.
// Later, these will come from your backend/MySQL database.

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
// These alerts are associated with stored sensor readings.

export const alerts = [
  {
    id: 1,
    sensorId: "WQM-001",
    recordedAt: "2026-09-18T10:00:00",
    parameter: "Turbidity",
    value: 90,
    message: "Turbidity exceeded the safe level.",
    severity: "warning",
  },
];


// ============================================================
// GET LATEST READING
// ============================================================
// Returns the newest sensor reading.

export const getLatestReading = () => {
  if (!Array.isArray(readings) || readings.length === 0) {
    return null;
  }

  return [...readings].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() -
      new Date(a.recordedAt).getTime()
  )[0];
};


// ============================================================
// GET SENSOR STATUS
// ============================================================
// Determines the current sensor status based on the latest reading.

export const getSensorStatus = (reading) => {
  if (!reading) {
    return "NO DATA";
  }

  const hasAlert = alerts.some(
    (alert) =>
      alert.sensorId === reading.sensorId &&
      alert.recordedAt === reading.recordedAt
  );

  return hasAlert ? "WARNING" : "SAFE";
};


// ============================================================
// GET READINGS BY DATE
// ============================================================
// This will be useful for the Analytics page date filter.

export const getReadingsByDate = (
  startDate,
  endDate
) => {
  if (!startDate && !endDate) {
    return readings;
  }

  return readings.filter((reading) => {
    const readingDate = new Date(reading.recordedAt);

    const start = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;

    const end = endDate
      ? new Date(`${endDate}T23:59:59`)
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
// Useful for the Analytics page.

export const getAlertsByDate = (
  startDate,
  endDate
) => {
  if (!startDate && !endDate) {
    return alerts;
  }

  return alerts.filter((alert) => {
    const alertDate = new Date(alert.recordedAt);

    const start = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;

    const end = endDate
      ? new Date(`${endDate}T23:59:59`)
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
// Used by the Logs section.

export const getLatestReadings = (limit = 5) => {
  return [...readings]
    .sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() -
        new Date(a.recordedAt).getTime()
    )
    .slice(0, limit);
};