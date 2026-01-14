import { useEffect, useState } from "react";
import useAdminGuard from "../hooks/useAdminGuard";

import {
  getAllDrivers,
  verifyDriver,
} from "../services/adminDriversApi";

export default function AdminDrivers() {
  useAdminGuard();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const loadDrivers = () => {
    setLoading(true);
    getAllDrivers()
      .then((res) => {
        setDrivers(res.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleVerify = async (driverId) => {
    try {
      setVerifyingId(driverId);
      await verifyDriver(driverId);

      // update UI instantly
      setDrivers((prev) =>
        prev.map((d) =>
          d.driver_id === driverId
            ? { ...d, is_verified: true }
            : d
        )
      );
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading drivers…</div>;
  }

  return (
    <>
      <h1 className="admin-title">Drivers</h1>

      {drivers.length === 0 ? (
        <p className="admin-empty">No drivers found.</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Online</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.driver_id}>
                  <td>{driver.name}</td>
                  <td>{driver.email}</td>

                  <td>
                    {driver.is_verified ? "Yes" : "No"}
                  </td>

                  <td>
                    {driver.is_online ? "Online" : "Offline"}
                  </td>

                  <td>
                    {!driver.is_verified ? (
                      <button
                        className="verify-btn"
                        disabled={verifyingId === driver.driver_id}
                        onClick={() =>
                          handleVerify(driver.driver_id)
                        }
                      >
                        {verifyingId === driver.driver_id
                          ? "Verifying…"
                          : "Verify"}
                      </button>
                    ) : (
                      <span className="verified-label">
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
