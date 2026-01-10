const UserPaymentsTable = ({ payments }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>₹{p.amount}</td>
            <td>{p.payment_method || "-"}</td>
            <td>{new Date(p.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserPaymentsTable;
