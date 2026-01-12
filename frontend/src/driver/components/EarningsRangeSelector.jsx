import "../styles/earningsRangeSelector.css";

const RANGES = [
  { label: "Today", value: "today" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "Custom", value: "custom" },
];

const EarningsRangeSelector = ({
  value,
  onChange,
  customStart,
  customEnd,
  onCustomChange,
}) => {
  return (
    <div className="earnings-range-wrapper">
      <div className="earnings-range-selector">
        {RANGES.map((range) => (
          <button
            key={range.value}
            className={`range-btn ${value === range.value ? "active" : ""}`}
            onClick={() => onChange(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>

      {value === "custom" && (
        <div className="custom-date-inputs">
          <input
            type="date"
            value={customStart}
            onChange={(e) =>
              onCustomChange({
                startDate: e.target.value,
                endDate: customEnd,
              })
            }
          />
          <span>to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) =>
              onCustomChange({
                startDate: customStart,
                endDate: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default EarningsRangeSelector;
