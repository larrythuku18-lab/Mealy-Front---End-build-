import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useDailyOptions } from "../contexts/DailyOptionsContext";
import { meals, currentUser } from "../data/mockData";
import "./Admin.css";

const emptyForm = { name: "", description: "", price: "", image: "" };

function Admin() {
  const { options: dailyOptions, addOption, updateOption, removeOption } =
    useDailyOptions();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const totalMeals = meals.length;
  const availableMeals = meals.filter((m) => m.available).length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image:
        form.image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    };

    if (editingId) {
      updateOption(editingId, payload);
    } else {
      addOption(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (option) => {
    setForm({
      name: option.name,
      description: option.description,
      price: option.price,
      image: option.image,
    });
    setEditingId(option.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this daily option?")) {
      removeOption(id);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="page">
      <Navbar user={{ ...currentUser, role: "admin" }} />
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Manage meals, daily options, and menu settings</p>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{dailyOptions.length}</span>
              <span className="stat-label">Daily Options</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalMeals}</span>
              <span className="stat-label">Total Meals</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{availableMeals}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">3</span>
              <span className="stat-label">Active Orders</span>
            </div>
          </div>

          {/* Daily Options Management */}
          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Daily Options</h2>
              <button
                className="btn-primary btn-primary--inline"
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                + Add Option
              </button>
            </div>

            {showForm && (
              <form className="daily-option-form" onSubmit={handleSubmit}>
                <h3>{editingId ? "Edit Daily Option" : "New Daily Option"}</h3>
                <div className="form-grid">
                  <div className="input-primary">
                    <label htmlFor="opt-name">Name</label>
                    <input
                      id="opt-name"
                      name="name"
                      placeholder="e.g. Beef with Rice"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-primary">
                    <label htmlFor="opt-price">Price (KSh)</label>
                    <input
                      id="opt-price"
                      name="price"
                      type="number"
                      min="0"
                      placeholder="1050"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-primary form-grid-full">
                    <label htmlFor="opt-desc">Description</label>
                    <input
                      id="opt-desc"
                      name="description"
                      placeholder="Short description of the meal"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-primary form-grid-full">
                    <label htmlFor="opt-image">Image URL (optional)</label>
                    <input
                      id="opt-image"
                      name="image"
                      placeholder="https://..."
                      value={form.image}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingId ? "Save Changes" : "Add Option"}
                  </button>
                </div>
              </form>
            )}

            <div className="admin-table">
              <div className="table-header">
                <span className="col-name">Name</span>
                <span className="col-desc">Description</span>
                <span className="col-price">Price</span>
                <span className="col-actions">Actions</span>
              </div>
              {dailyOptions.map((option) => (
                <div key={option.id} className="table-row">
                  <span className="col-name">{option.name}</span>
                  <span className="col-desc">{option.description}</span>
                  <span className="col-price">
                    KSh {option.price.toLocaleString()}
                  </span>
                  <span className="col-actions">
                    <button
                      className="action-btn action-edit"
                      onClick={() => handleEdit(option)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn action-delete"
                      onClick={() => handleDelete(option.id)}
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))}
              {dailyOptions.length === 0 && (
                <div className="table-empty">No daily options yet.</div>
              )}
            </div>
          </section>

          {/* Full Menu Table */}
          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Full Menu</h2>
              <button className="btn-primary btn-primary--inline">
                + Add Meal
              </button>
            </div>
            <div className="admin-table">
              <div className="table-header">
                <span className="col-name">Name</span>
                <span className="col-category">Category</span>
                <span className="col-price">Price</span>
                <span className="col-status">Status</span>
              </div>
              {meals.map((meal) => (
                <div key={meal.id} className="table-row">
                  <span className="col-name">{meal.name}</span>
                  <span className="col-category">{meal.category}</span>
                  <span className="col-price">
                    KSh {meal.price.toLocaleString()}
                  </span>
                  <span
                    className={`col-status ${meal.available ? "active" : "inactive"}`}
                  >
                    {meal.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Admin;
