import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import BtnPrimary from "../components/ui/BtnPrimary";
import InputPrimary from "../components/ui/InputPrimary";
import { currentUser } from "../data/mockData";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: integrate with backend API
    setIsEditing(false);
  };

  return (
    <div className="page">
      <Navbar user={currentUser} />
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your account details</p>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              <span>{currentUser.name ? currentUser.name.charAt(0) : "?"}</span>
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
                  <span>{form.phone}</span>
                </div>
                <div className="profile-field">
                  <label>Address</label>
                  <span>{form.address}</span>
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <span>{currentUser.joinedDate}</span>
                </div>
                <div className="profile-actions">
                  <BtnPrimary onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </BtnPrimary>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSave}>
                <InputPrimary
                  label="Full Name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <InputPrimary
                  label="Email Address"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <InputPrimary
                  label="Phone"
                  type="tel"
                  id="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                <InputPrimary
                  label="Address"
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                />
                <div className="profile-actions">
                  <BtnPrimary variant="cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </BtnPrimary>
                  <BtnPrimary variant="save" type="submit">
                    Save Changes
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
