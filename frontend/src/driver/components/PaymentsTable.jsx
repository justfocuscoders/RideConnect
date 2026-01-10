import StatusBadge from "./StatusBadge";

const PaymentsTable = ({ payments }) => {
  if (!payments.length) {
    return <p>No payments yet.</p>;
  }

  return (
    <table className="payments-table">
      <thead>
        <tr>
          <th>Ride ID</th>
          <th>Date</th>
          <th>Fare</th>
          <th>Commission</th>
          <th>Net</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.ride_id}>
            <td>{p.ride_id}</td>
            <td>{new Date(p.created_at).toLocaleDateString()}</td>
            <td>₹{p.amount}</td>
            <td>₹{p.commission}</td>
            <td>₹{p.net_amount}</td>
            <td>
              <StatusBadge status={p.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PaymentsTable;
