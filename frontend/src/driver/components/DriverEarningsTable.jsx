import "../styles/driverEarningsTable.css";

const DriverEarningsTable = ({ data }) => {
  if (!data || !data.days || data.days.length === 0) {
    return null;
  }

  return (
    <div className="earnings-table">
      <h3>Earnings Breakdown</h3>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Rides</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.days.map((row) => (
            <tr key={row.date}>
              <td>{row.date}</td>
              <td>{row.rides ?? "-"}</td>
              <td>₹{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverEarningsTable;
