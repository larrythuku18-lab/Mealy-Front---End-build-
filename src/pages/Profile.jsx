import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { apiGetProfile, apiUpdateProfile } from "../api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    apiGetProfile()
      .then((data) => {
        updateUser(data.user);
        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
      })
      .catch(() => {
        // Fall back to whatever the auth context already has.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const data = await apiUpdateProfile(form);
      updateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="page">
      <Navbar />
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your account details</p>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              <span>{form.name ? form.name.charAt(0) : "?"}</span>
            </div>

            {error && <p className="auth-error">{error}</p>}

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
                  <span>
                    {user?.joinedDate
                      ? new Date(user.joinedDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="profile-actions">
                  <Btn onClick={() => setIsEditing(true)}>Edit Profile</Btn>
                </div>
              </div>
            ) : (
              <form className="profile-form" onSubmit={handleSave}>
                <Input
                  label="Full Name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <Input
                  label="Phone"
                  type="tel"
                  id="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Address"
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                />
                <div className="profile-actions">
                  <Btn variant="cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Btn>
                  <Btn variant="save" type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                  </Btn>
                </div>
              </form>
            )}

            {isAuthenticated && (
              <div className="profile-logout">
                <Btn variant="secondary" title="Log out of Mealy" onClick={handleLogout}>
                  Log Out
                </Btn>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
