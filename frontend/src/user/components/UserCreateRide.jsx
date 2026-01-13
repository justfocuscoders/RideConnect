import { useState } from "react";
import api from "../../services/api";

const CreateRideForm = () => {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ CRITICAL LINE

    try {
      await api.post("/rides", {
        pickup_location: pickup,
        drop_location: drop,
        distance_km: Number(distance),
      });

      // Optional UX
      setPickup("");
      setDrop("");
      setDistance("");

      alert("Ride requested successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create ride");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        placeholder="Pickup location"
        required
      />

      <input
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
        placeholder="Drop location"
        required
      />

      <input
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="Distance (km)"
        type="number"
        required
      />

      {/* IMPORTANT */}
      <button type="submit">Book Ride</button>
    </form>
  );
};

export default CreateRideForm;
