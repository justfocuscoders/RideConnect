const AccountSummaryCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="card">
      <h3>Account Summary</h3>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Name:</strong> {user.name || "Not set"}</p>
      <p><strong>Phone:</strong> {user.phone || "Not set"}</p>
    </div>
  );
};

export default AccountSummaryCard;
