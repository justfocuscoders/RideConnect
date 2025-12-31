import { useEffect, useState } from "react"
import { getCurrentUser, updateProfile } from "../services/api"

function Profile() {
  const [form, setForm] = useState({ name: "", phone: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCurrentUser().then(res => {
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
      })
    })
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await updateProfile(form)
    setLoading(false)
    alert("Profile updated successfully")
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Profile</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <button disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  )
}

export default Profile
