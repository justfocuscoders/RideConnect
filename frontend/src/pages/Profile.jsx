import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW STATES FOR EDITING
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);

        // Prefill form
        setFormData({
          name: response.data.name || "",
          phone: response.data.phone || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim() && !formData.phone.trim()) {
    setError("Please update at least one field");
    return;
  }

  setSaving(true);
  setError("");
  setSuccess("");

  try {
    const response = await api.put("/users/me", formData);

    setUser(response.data); // refresh UI
    setSuccess("Profile updated successfully");
    setIsEditing(false);
  } catch (err) {
    setError("Failed to update profile");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p>Loading profile...</p>;
  if (error && !isEditing) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>User Profile</h2>

      {/* VIEW MODE */}
      {!isEditing && (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name || "Not set"}</p>
          <p><strong>Phone:</strong> {user.phone || "Not set"}</p>

          <button onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>

          {success && <p style={{ color: "green" }}>{success}</p>}
        </>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label><br />
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>Phone</label><br />
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
  type="button"
  style={{ marginLeft: "10px" }}
  onClick={() => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
    });
    setIsEditing(false);
    setError("");
  }}
>
  Cancel
</button>

          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default Profile;
