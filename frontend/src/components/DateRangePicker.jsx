import { useState, useEffect } from "react";

function DateRangePicker({ startDate, endDate, onChange }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Sync incoming Date objects → input values
  useEffect(() => {
    if (startDate) {
      setStart(toInputDate(startDate));
    }
    if (endDate) {
      setEnd(toInputDate(endDate));
    }
  }, [startDate, endDate]);

  const toInputDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);

    if (newStart && end) {
      onChange(new Date(newStart), new Date(end));
    }
  };

  const handleEndChange = (e) => {
    const newEnd = e.target.value;
    setEnd(newEnd);

    if (start && newEnd) {
      onChange(new Date(start), new Date(newEnd));
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        type="date"
        value={start}
        onChange={handleStartChange}
      />
      <span>to</span>
      <input
        type="date"
        value={end}
        onChange={handleEndChange}
      />
    </div>
  );
}

export default DateRangePicker;
