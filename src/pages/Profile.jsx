import { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import BtnPrimary from "../components/ui/BtnPrimary";
import InputPrimary from "../components/ui/InputPrimary";
import { useAuth } from "../context/AuthContext";
import { apiUpdateProfile } from "../api";
import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await apiUpdateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      updateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="page">
      <Navbar user={user} />
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your account details</p>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              <span>{user?.name ? user.name.charAt(0) : "?"}</span>
            </div>

            {!isEditing ? (
              <div className="profile-info">
                <div className="profile-field">
                  <label>Full Name</label>
                  <span>{form.name}</span>
                </div>
                <div className="profile-field">
                  <label>Email Address</label>
                  <span>{form.email}</span>
                </div>
                <div className="profile-field">
                  <label>Phone</label>
                  <span>{form.phone || "Not set"}</span>
                </div>
                <div className="profile-field">
                  <label>Address</label>
                  <span>{form.address || "Not set"}</span>
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <span>{joinedDate}</span>
                </div>
                <div className="profile-actions">
                  <BtnPrimary onClick={() => setIsEditing(true)}>Edit Profile</BtnPrimary>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSave}>
                <InputPrimary
                  label="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />
                <InputPrimary
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <InputPrimary
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                />
                <InputPrimary
                  label="Address"
                  value={form.address}
                  onChange={handleChange}
                />
                <div className="profile-actions">
                  <BtnPrimary
                    variant="cancel"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </BtnPrimary>
                  <BtnPrimary variant="save" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </BtnPrimary>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
