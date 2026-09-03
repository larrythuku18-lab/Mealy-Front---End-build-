import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useDailyOptions } from "../contexts/DailyOptionsContext";
import { meals, currentUser } from "../data/mockData";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  Clock,
  CheckCircle,
  ShoppingBag,
  Search,
  Menu,
  CheckCircle as CheckIcon,
  XCircle,
} from "lucide-react";
import "./Admin.css";

/** Animates a number from 0 → target using rAF. */
function AnimatedNumber({ target, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return <>{display}</>;
}

const emptyForm = { name: "", description: "", price: "", image: "" };

function Admin() {
  const { options: dailyOptions, addOption, updateOption, removeOption } =
    useDailyOptions();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyPage, setDailyPage] = useState(1);
  const [menuPage, setMenuPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [menuMeals, setMenuMeals] = useState(meals);
  const [toast, setToast] = useState(null);
  const PAGE_SIZE = 6;
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setDailyPage(1);
    setMenuPage(1);
    setSidebarOpen(false);
  };

  const handleToggleAvailability = useCallback((mealId) => {
    setMenuMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, available: !m.available } : m))
    );
  }, []);

  const totalMeals = menuMeals.length;
  const availableMeals = menuMeals.filter((m) => m.available).length;
  const allCategories = [...new Set(menuMeals.flatMap((m) => m.category))].sort();

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
      showToast("Daily option updated");
    } else {
      addOption(payload);
      showToast("Daily option added");
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
      showToast("Daily option removed");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const filteredMeals = useMemo(
    () =>
      menuMeals.filter(
        (meal) =>
          (meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            meal.category.some((cat) =>
              cat.toLowerCase().includes(searchQuery.toLowerCase())
            )) &&
          (!categoryFilter || meal.category.includes(categoryFilter))
      ),
    [menuMeals, searchQuery, categoryFilter]
  );

  // Pagination helpers
  const dailyTotalPages = Math.max(1, Math.ceil(dailyOptions.length / PAGE_SIZE));
  const dailyPageItems = dailyOptions.slice(
    (dailyPage - 1) * PAGE_SIZE,
    dailyPage * PAGE_SIZE
  );
  const menuTotalPages = Math.max(1, Math.ceil(filteredMeals.length / PAGE_SIZE));
  const menuPageItems = filteredMeals.slice(
    (menuPage - 1) * PAGE_SIZE,
    menuPage * PAGE_SIZE
  );

  return (
    <div className="admin-layout">
      <Navbar user={{ ...currentUser, role: "admin" }} />

      <div className="admin-wrapper">
        {/* Mobile hamburger */}
        <button
          className="sidebar-hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}>
          <div className="sidebar-header">
            <LayoutDashboard size={20} />
            <span>Admin Panel</span>
          </div>
          <nav className="sidebar-nav">
            <button
              className={`sidebar-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => handleTabChange("dashboard")}
            >
              <TrendingUp size={18} />
              <span>Dashboard</span>
            </button>
            <button
              className={`sidebar-link ${activeTab === "daily" ? "active" : ""}`}
              onClick={() => handleTabChange("daily")}
            >
              <CalendarDays size={18} />
              <span>Daily Options</span>
            </button>
            <button
              className={`sidebar-link ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => handleTabChange("menu")}
            >
              <UtensilsCrossed size={18} />
              <span>Full Menu</span>
            </button>
            <button
              className={`sidebar-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => handleTabChange("orders")}
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {activeTab === "dashboard" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Dashboard</h1>
                  <p className="admin-subtitle">
                    Welcome back! Here&apos;s what&apos;s happening with your
                    restaurant.
                  </p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card stat-card--primary">
                  <div className="stat-icon">
                    <CalendarDays size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number"><AnimatedNumber target={dailyOptions.length} /></span>
                    <span className="stat-label">Daily Options</span>
                  </div>
                </div>
                <div className="stat-card stat-card--success">
                  <div className="stat-icon">
                    <UtensilsCrossed size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number"><AnimatedNumber target={totalMeals} /></span>
                    <span className="stat-label">Total Meals</span>
                  </div>
                </div>
                <div className="stat-card stat-card--warning">
                  <div className="stat-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number"><AnimatedNumber target={availableMeals} /></span>
                    <span className="stat-label">Available</span>
                  </div>
                </div>
                <div className="stat-card stat-card--info">
                  <div className="stat-icon">
                    <Clock size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number"><AnimatedNumber target={3} /></span>
                    <span className="stat-label">Active Orders</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>Recent Orders</h3>
                  <div className="order-list">
                    <div className="order-item">
                      <div className="order-info">
                        <span className="order-id">ORD-001</span>
                        <span className="order-items">Pancake Stack ×2, Berry Smoothie</span>
                      </div>
                      <span className="order-status order-status--delivered">Delivered</span>
                    </div>
                    <div className="order-item">
                      <div className="order-info">
                        <span className="order-id">ORD-002</span>
                        <span className="order-items">Grilled Chicken Pasta, Mushroom Omelette ×2</span>
                      </div>
                      <span className="order-status order-status--transit">In Transit</span>
                    </div>
                    <div className="order-item">
                      <div className="order-info">
                        <span className="order-id">ORD-003</span>
                        <span className="order-items">Caesar Salad</span>
                      </div>
                      <span className="order-status order-status--preparing">Preparing</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card">
                  <h3>Top Categories</h3>
                  <div className="category-stats">
                    {["Whole Meals", "Fast Foods", "Drinks", "Breakfast", "Snacks"].map(
                      (cat) => {
                        const count = meals.filter((m) =>
                          m.category.includes(cat)
                        ).length;
                        const percentage = Math.round((count / totalMeals) * 100);
                        return (
                          <div key={cat} className="category-bar">
                            <div className="category-bar-header">
                              <span>{cat}</span>
                              <span>{count} items</span>
                            </div>
                            <div className="category-bar-track">
                              <div
                                className="category-bar-fill"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "daily" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Daily Options</h1>
                  <p className="admin-subtitle">
                    Manage today&apos;s special meal offerings.
                  </p>
                </div>
                <button
                  className="btn-add"
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  <Plus size={18} />
                  Add Option
                </button>
              </div>

              {showForm && (
                <div className="form-modal-overlay" onClick={handleCancel}>
                  <div
                    className="form-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="form-modal-header">
                      <h3>
                        {editingId ? "Edit Daily Option" : "New Daily Option"}
                      </h3>
                      <button
                        className="form-modal-close"
                        onClick={handleCancel}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="admin-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="opt-name">Meal Name</label>
                          <input
                            id="opt-name"
                            name="name"
                            placeholder="e.g. Beef with Rice"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group">
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
                        <div className="form-group form-group--full">
                          <label htmlFor="opt-desc">Description</label>
                          <input
                            id="opt-desc"
                            name="description"
                            placeholder="Short description of the meal"
                            value={form.description}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group form-group--full">
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
                  </div>
                </div>
              )}

              <div className="data-table">
                <div className="table-header-row">
                  <span className="col-checkbox">
                    <input type="checkbox" />
                  </span>
                  <span className="col-name">Meal Name</span>
                  <span className="col-desc">Description</span>
                  <span className="col-price">Price</span>
                  <span className="col-actions">Actions</span>
                </div>
                {dailyPageItems.map((option) => (
                  <div key={option.id} className="table-row">
                    <span className="col-checkbox">
                      <input type="checkbox" />
                    </span>
                    <span className="col-name">
                      <div className="meal-cell">
                        <img
                          src={option.image}
                          alt={option.name}
                          className="meal-thumb"
                        />
                        <span>{option.name}</span>
                      </div>
                    </span>
                    <span className="col-desc">{option.description}</span>
                    <span className="col-price">
                      KSh {option.price.toLocaleString()}
                    </span>
                    <span className="col-actions">
                      <button
                        className="action-btn action-edit"
                        onClick={() => handleEdit(option)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="action-btn action-delete"
                        onClick={() => handleDelete(option.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  </div>
                ))}
                {dailyOptions.length === 0 && (
                  <div className="table-empty">
                    <UtensilsCrossed size={48} />
                    <p>No daily options yet. Add your first meal!</p>
                  </div>
                )}
              </div>

              <div className="table-pagination">
                <span className="page-count">
                  Showing {dailyOptions.length === 0 ? 0 : (dailyPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(dailyPage * PAGE_SIZE, dailyOptions.length)} of {dailyOptions.length}
                </span>
                {dailyTotalPages > 1 && (
                  <>
                    <button
                      className="page-btn"
                      disabled={dailyPage <= 1}
                      onClick={() => setDailyPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {dailyPage} of {dailyTotalPages}
                    </span>
                    <button
                      className="page-btn"
                      disabled={dailyPage >= dailyTotalPages}
                      onClick={() => setDailyPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "menu" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Full Menu</h1>
                  <p className="admin-subtitle">
                    Manage all available meals and categories.
                  </p>
                </div>
                <div className="header-actions">
                  <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setMenuPage(1);
                    }}
                  >
                    <option value="">All Categories</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="search-input">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search meals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {categoryFilter && (
                    <button
                      className="btn-clear-filter"
                      onClick={() => {
                        setCategoryFilter("");
                        setMenuPage(1);
                      }}
                    >
                      <X size={14} />
                      Clear filter
                    </button>
                  )}
                  <button className="btn-add">
                    <Plus size={18} />
                    Add Meal
                  </button>
                </div>
              </div>

              <div className="data-table">
                <div className="table-header-row">
                  <span className="col-checkbox">
                    <input type="checkbox" />
                  </span>
                  <span className="col-name">Meal Name</span>
                  <span className="col-category">Category</span>
                  <span className="col-price">Price</span>
                  <span className="col-rating">Rating</span>
                  <span className="col-status">Status</span>
                </div>
                {menuPageItems.map((meal) => (
                  <div key={meal.id} className="table-row">
                    <span className="col-checkbox">
                      <input type="checkbox" />
                    </span>
                    <span className="col-name">
                      <div className="meal-cell">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="meal-thumb"
                        />
                        <span>{meal.name}</span>
                      </div>
                    </span>
                    <span className="col-category">
                      <div className="category-tags">
                        {meal.category.map((cat) => (
                          <span key={cat} className="category-tag">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </span>
                    <span className="col-price">
                      KSh {meal.price.toLocaleString()}
                    </span>
                    <span className="col-rating">⭐ {meal.rating}</span>
                    <span className="col-status">
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={meal.available}
                          onChange={() => handleToggleAvailability(meal.id)}
                        />
                        <span className="toggle-slider" />
                        <span className="toggle-label">
                          {meal.available ? "Available" : "Unavailable"}
                        </span>
                      </label>
                    </span>
                  </div>
                )                )}
              </div>

              <div className="table-pagination">
                <span className="page-count">
                  Showing {filteredMeals.length === 0 ? 0 : (menuPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(menuPage * PAGE_SIZE, filteredMeals.length)} of {filteredMeals.length}
                </span>
                {menuTotalPages > 1 && (
                  <>
                    <button
                      className="page-btn"
                      disabled={menuPage <= 1}
                      onClick={() => setMenuPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {menuPage} of {menuTotalPages}
                    </span>
                    <button
                      className="page-btn"
                      disabled={menuPage >= menuTotalPages}
                      onClick={() => setMenuPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Toast notification */}
          {toast && (
            <div className={`toast toast--${toast.type}`}>
              {toast.type === "success" ? (
                <CheckIcon size={18} />
              ) : (
                <XCircle size={18} />
              )}
              <span>{toast.message}</span>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Orders</h1>
                  <p className="admin-subtitle">
                    View and manage customer orders.
                  </p>
                </div>
              </div>

              <div className="orders-grid">
                <div className="order-card">
                  <div className="order-card-header">
                    <span className="order-card-id">ORD-001</span>
                    <span className="status-badge status-badge--delivered">
                      Delivered
                    </span>
                  </div>
                  <div className="order-card-items">
                    <div className="order-card-item">
                      <span>Pancake Stack ×2</span>
                      <span>KSh 1,700</span>
                    </div>
                    <div className="order-card-item">
                      <span>Berry Smoothie ×1</span>
                      <span>KSh 650</span>
                    </div>
                  </div>
                  <div className="order-card-footer">
                    <span className="order-date">Aug 19, 2026</span>
                    <span className="order-total">Total: KSh 2,350</span>
                  </div>
                </div>

                <div className="order-card">
                  <div className="order-card-header">
                    <span className="order-card-id">ORD-002</span>
                    <span className="status-badge status-badge--transit">
                      In Transit
                    </span>
                  </div>
                  <div className="order-card-items">
                    <div className="order-card-item">
                      <span>Grilled Chicken Pasta ×1</span>
                      <span>KSh 1,400</span>
                    </div>
                    <div className="order-card-item">
                      <span>Mushroom Omelette ×2</span>
                      <span>KSh 1,900</span>
                    </div>
                  </div>
                  <div className="order-card-footer">
                    <span className="order-date">Aug 21, 2026</span>
                    <span className="order-total">Total: KSh 2,200</span>
                  </div>
                </div>

                <div className="order-card">
                  <div className="order-card-header">
                    <span className="order-card-id">ORD-003</span>
                    <span className="status-badge status-badge--preparing">
                      Preparing
                    </span>
                  </div>
                  <div className="order-card-items">
                    <div className="order-card-item">
                      <span>Caesar Salad ×1</span>
                      <span>KSh 1,000</span>
                    </div>
                  </div>
                  <div className="order-card-footer">
                    <span className="order-date">Aug 21, 2026</span>
                    <span className="order-total">Total: KSh 1,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Admin;
