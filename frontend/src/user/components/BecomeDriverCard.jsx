const BecomeDriverCard = ({ onClick }) => {
  return (
    <div className="card border p-4">
      <h3 className="text-lg font-semibold">Become a Driver</h3>
      <p className="text-sm text-gray-600 mt-1">
        Earn money by accepting ride requests.
      </p>
      <button
        onClick={onClick}
        className="mt-3 btn btn-primary"
      >
        Start Driver Registration
      </button>
    </div>
  );
};

export default BecomeDriverCard;
