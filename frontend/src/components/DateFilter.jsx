function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  return (

    <div className="date-filter">

      <label>
        FILTER DATE
      </label>

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          onStartDateChange(
            e.target.value
          )
        }
      />

      <span>-</span>

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          onEndDateChange(
            e.target.value
          )
        }
      />

    </div>

  );
}

export default DateFilter;