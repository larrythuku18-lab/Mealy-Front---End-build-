import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useMealOptions } from "../context/MealOptionsContext";
import { useMenu } from "../context/MenuContext";
import { useOrders } from "../context/OrdersContext";
import { useDailyOptions } from "../contexts/DailyOptionsContext";
import { apiListCategories, apiUpdateOrderStatus } from "../api";
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

const STATUS_ORDER = ["confirmed", "preparing", "in_transit", "delivered"];
const STATUS_LABELS = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  in_transit: "In Transit",
  delivered: "Delivered",
};
const STATUS_BADGE_CLASS = {
  confirmed: "status-badge--confirmed",
  preparing: "status-badge--preparing",
  in_transit: "status-badge--transit",
  delivered: "status-badge--delivered",
};

function orderStatusVariant(status) {
  return {
    confirmed: "confirmed",
    preparing: "preparing",
    in_transit: "transit",
    delivered: "delivered",
  }[status];
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
};

/** Meal options may hold a single category string or an array. */
function toCategoryList(option) {
  const cat = option?.category;
  if (!cat) return [];
  return Array.isArray(cat) ? cat : [cat];
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function orderCustomer(order) {
  return (
    order.customer?.name ||
    order.customerName ||
    order.user?.name ||
    "Customer"
  );
}

/** Normalize the items of an order regardless of backend shape. */
function orderLines(order) {
  if (Array.isArray(order.items) && order.items.length > 0) return order.items;
  if (Array.isArray(order.meals) && order.meals.length > 0) return order.meals;
  if (order.mealOptionName || order.meal?.name) {
    const meal = order.meal || {};
    return [
      {
        name: order.mealOptionName || meal.name,
        quantity: order.quantity ?? 1,
        price: order.price ?? meal.price ?? 0,
      },
    ];
  }
  return [];
}

function orderTotal(order) {
  const lines = orderLines(order);
  if (lines.length > 0) {
    return lines.reduce(
      (sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 1),
      0
    );
  }
  return Number(order.total ?? order.price ?? 0);
}

function Admin() {
  const {
    fetchMealOptions,
    items: mealOptions,
    status: mealStatus,
    createMealOption,
    updateMealOption,
    deleteMealOption,
  } = useMealOptions();
  const { mealOptionIds, fetchTodaysMenu, publishMenu } = useMenu();
  const { items: todaysOrders, fetchTodaysOrders } = useOrders();
  const {
    options: publishedOptions,
    fetchDailyOptions,
  } = useDailyOptions();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuPage, setMenuPage] = useState(1);
  const [categoryNames, setCategoryNames] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Meal form modal state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Today's menu picker state
  const [overrides, setOverrides] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const PAGE_SIZE = 6;

  const showToast = useCallback((message, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Load everything once on mount
  useEffect(() => {
    fetchMealOptions();
    fetchTodaysMenu();
    fetchTodaysOrders();
    fetchDailyOptions();
    apiListCategories()
      .then((data) =>
        setCategoryNames((data.categories || []).map((cat) => cat.name))
      )
      .catch(() => {
        // Categories endpoint unavailable — the category field still works as free text
      });
  }, [fetchMealOptions, fetchTodaysMenu, fetchTodaysOrders, fetchDailyOptions]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMenuPage(1);
    setSidebarOpen(false);
  };

  /* ── Derived ─────────────────────────────────────────────────────────── */

  const publishedIds = mealOptionIds || [];
  const totalMeals = mealOptions.length;
  const publishedCount = publishedOptions.length;
  const todayRevenue = useMemo(
    () => todaysOrders.reduce((sum, order) => sum + orderTotal(order), 0),
    [todaysOrders]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    mealOptions.forEach((option) => {
      toCategoryList(option).forEach((cat) => {
        counts.set(cat, (counts.get(cat) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [mealOptions]);

  const filteredMeals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return mealOptions.filter((meal) => {
      const cats = toCategoryList(meal);
      const matchesQuery =
        !query ||
        meal.name.toLowerCase().includes(query) ||
        cats.some((c) => c.toLowerCase().includes(query));
      const matchesCategory = !categoryFilter || cats.includes(categoryFilter);
      return matchesQuery && matchesCategory;
    });
  }, [mealOptions, searchQuery, categoryFilter]);

  const allCategories = useMemo(() => {
    const set = new Set();
    mealOptions.forEach((option) =>
      toCategoryList(option).forEach((c) => set.add(c))
    );
    return [...set].sort();
  }, [mealOptions]);

  const menuTotalPages = Math.max(1, Math.ceil(filteredMeals.length / PAGE_SIZE));
  const menuPageItems = filteredMeals.slice(
    (menuPage - 1) * PAGE_SIZE,
    menuPage * PAGE_SIZE
  );

  /* ── Meal form handlers ─────────────────────────────────────────────── */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      image: form.image.trim(),
    };

    try {
      if (editingId) {
        await updateMealOption(editingId, payload);
        showToast("Meal updated");
      } else {
        await createMealOption(payload);
        showToast("Meal added");
      }
      await fetchDailyOptions();
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* ── Meal CRUD ──────────────────────────────────────────────────────── */

  const handleEdit = (option) => {
    setForm({
      name: option.name || "",
      description: option.description || "",
      price: option.price != null ? String(option.price) : "",
      category: toCategoryList(option)[0] || "",
      image: option.image || "",
    });
    setEditingId(option.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (option) => {
    if (!window.confirm(`Remove "${option.name}" from your menu?`)) return;
    try {
      const wasOnTodaysMenu = publishedIds.includes(option.id);
      await deleteMealOption(option.id);
      if (wasOnTodaysMenu) {
        // Keep today's menu in sync when a published meal is deleted
        try {
          await publishMenu(publishedIds.filter((id) => id !== option.id));
        } catch {
          // Ignore — today's menu is refreshed below
        }
      }
      await fetchDailyOptions();
      showToast("Meal removed");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* ── Today's menu picker ────────────────────────────────────────────── */

  const selectedIds = overrides ?? publishedIds;

  const toggleForToday = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setOverrides(next);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishMenu(selectedIds);
      setOverrides(null);
      await fetchDailyOptions();
      showToast(
        selectedIds.length === 0
          ? "Today's menu cleared"
          : `Published ${selectedIds.length} meal${selectedIds.length > 1 ? "s" : ""} for today`
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsPublishing(false);
    }
  };

  /* ── Order status updates ───────────────────────────────────────────── */

  const handleStatusChange = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      await apiUpdateOrderStatus(orderId, status);
      showToast(`Order ${orderId} marked ${STATUS_LABELS[status] || status}`);
      await fetchTodaysOrders();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const orderSummary = (order) => {
    const lines = orderLines(order);
    const text = lines
      .slice(0, 2)
      .map((line) => `${line.name}${Number(line.quantity) > 1 ? ` ×${line.quantity}` : ""}`)
      .join(", ");
    return lines.length > 2 ? `${text} +${lines.length - 2} more` : text || "Order";
  };

  /* ── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="admin-layout">
      <Navbar />

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
              className={`sidebar-link ${activeTab === "today" ? "active" : ""}`}
              onClick={() => handleTabChange("today")}
            >
              <CalendarDays size={18} />
              <span>Today's Menu</span>
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
                    <span className="stat-number"><AnimatedNumber target={publishedCount} /></span>
                    <span className="stat-label">On Today&apos;s Menu</span>
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
                    <ShoppingBag size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number"><AnimatedNumber target={todaysOrders.length} /></span>
                    <span className="stat-label">Today&apos;s Orders</span>
                  </div>
                </div>
                <div className="stat-card stat-card--info">
                  <div className="stat-icon">
                    <Clock size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">KSh {todayRevenue.toLocaleString()}</span>
                    <span className="stat-label">Today&apos;s Revenue</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card">
                  <h3>Latest Orders</h3>
                  {todaysOrders.length === 0 ? (
                    <div className="table-empty">
                      <ShoppingBag size={48} />
                      <p>No orders have come in today yet.</p>
                    </div>
                  ) : (
                    <div className="order-list">
                      {todaysOrders.slice(0, 5).map((order) => (
                        <div className="order-item" key={order.id}>
                          <div className="order-info">
                            <span className="order-id">
                              {order.id ?? order.order_id ?? "Order"}
                            </span>
                            <span className="order-items">{orderSummary(order)}</span>
                          </div>
                          <span
                            className={`order-status ${orderStatusVariant(order.status) ? `order-status--${orderStatusVariant(order.status)}` : ""}`}
                          >
                            {STATUS_LABELS[order.status] || order.status || "Placed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dashboard-card">
                  <h3>Top Categories</h3>
                  {categoryCounts.length === 0 ? (
                    <div className="table-empty">
                      <UtensilsCrossed size={48} />
                      <p>No meals in your catalog yet.</p>
                    </div>
                  ) : (
                    <div className="category-stats">
                      {categoryCounts.map(([cat, count]) => {
                        const percentage = Math.round(
                          (count / Math.max(totalMeals, 1)) * 100
                        );
                        return (
                          <div key={cat} className="category-bar">
                            <div className="category-bar-header">
                              <span>{cat}</span>
                              <span>{count} item{count > 1 ? "s" : ""}</span>
                            </div>
                            <div className="category-bar-track">
                              <div
                                className="category-bar-fill"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "today" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Today&apos;s Menu</h1>
                  <p className="admin-subtitle">
                    Choose which meals customers can order today, then publish.
                  </p>
                </div>
                {mealOptions.length === 0 && (
                  <button className="btn-add" onClick={() => handleTabChange("menu")}>
                    <Plus size={18} />
                    Add Meals First
                  </button>
                )}
              </div>

              {mealStatus === "loading" && <p>Loading meal options...</p>}
              {mealStatus === "failed" && (
                <p className="admin-subtitle">Could not load meal options.</p>
              )}

              {mealOptions.length > 0 && (
                <>
                  <div className="data-table">
                    <div className="table-header-row">
                      <span className="col-checkbox">On menu</span>
                      <span className="col-name">Meal</span>
                      <span className="col-desc">Category</span>
                      <span className="col-price">Price</span>
                      <span className="col-actions" />
                    </div>
                    {mealOptions.map((option) => {
                      const checked = selectedIds.includes(option.id);
                      return (
                        <div key={option.id} className="table-row">
                          <span className="col-checkbox">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleForToday(option.id)}
                              aria-label={`Include ${option.name} on today's menu`}
                            />
                          </span>
                          <span className="col-name">
                            <div className="meal-cell">
                              {option.image && (
                                <img
                                  src={option.image}
                                  alt={option.name}
                                  className="meal-thumb"
                                />
                              )}
                              <span>{option.name}</span>
                            </div>
                          </span>
                          <span className="col-desc">
                            {toCategoryList(option).join(", ") || "—"}
                          </span>
                          <span className="col-price">
                            KSh {Number(option.price || 0).toLocaleString()}
                          </span>
                          <span className="col-actions" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="today-menu-actions">
                    <span className="page-count">
                      {selectedIds.length} of {mealOptions.length} meals on
                      today&apos;s menu
                    </span>
                    {overrides !== null && (
                      <button
                        type="button"
                        className="page-btn"
                        onClick={() => setOverrides(null)}
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-add"
                      onClick={handlePublish}
                      disabled={isPublishing}
                    >
                      {isPublishing
                        ? "Publishing..."
                        : overrides !== null
                          ? "Publish Changes"
                          : "Publish Menu"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "menu" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Full Menu</h1>
                  <p className="admin-subtitle">
                    Manage the meals in your catalog.
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
                  <button
                    className="btn-add"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                      setShowForm(true);
                    }}
                  >
                    <Plus size={18} />
                    Add Meal
                  </button>
                </div>
              </div>

              {showForm && (
                <div className="form-modal-overlay" onClick={handleCancel}>
                  <div
                    className="form-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="form-modal-header">
                      <h3>{editingId ? "Edit Meal" : "Add New Meal"}</h3>
                      <button
                        className="form-modal-close"
                        onClick={handleCancel}
                        aria-label="Close"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <form onSubmit={handleSubmit} className="admin-form">
                      <div className="form-grid">
                        <div className="form-group form-group--full">
                          <label htmlFor="meal-name">Meal Name</label>
                          <input
                            id="meal-name"
                            name="name"
                            placeholder="e.g. Beef with Rice"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="meal-price">Price (KSh)</label>
                          <input
                            id="meal-price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="1050"
                            value={form.price}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="meal-category">Category</label>
                          <input
                            id="meal-category"
                            name="category"
                            list="meal-categories"
                            placeholder="e.g. Whole Meals"
                            value={form.category}
                            onChange={handleChange}
                          />
                          <datalist id="meal-categories">
                            {categoryNames.map((cat) => (
                              <option key={cat} value={cat} />
                            ))}
                          </datalist>
                        </div>
                        <div className="form-group form-group--full">
                          <label htmlFor="meal-desc">Description</label>
                          <input
                            id="meal-desc"
                            name="description"
                            placeholder="Short description of the meal"
                            value={form.description}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group form-group--full">
                          <label htmlFor="meal-image">Image URL (optional)</label>
                          <input
                            id="meal-image"
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
                          {editingId ? "Save Changes" : "Add Meal"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {mealStatus === "loading" && <p>Loading meal options...</p>}
              {mealStatus === "failed" && (
                <p className="admin-subtitle">Could not load meal options.</p>
              )}

              {mealOptions.length > 0 ? (
                <>
                  <div className="data-table">
                    <div className="table-header-row">
                      <span className="col-checkbox" />
                      <span className="col-name">Meal</span>
                      <span className="col-desc">Description</span>
                      <span className="col-price">Price</span>
                      <span className="col-actions">Actions</span>
                    </div>
                    {menuPageItems.map((meal) => {
                      const isPublishedToday = publishedIds.includes(meal.id);
                      return (
                        <div key={meal.id} className="table-row">
                          <span className="col-checkbox">
                            {isPublishedToday && (
                              <CheckCircle size={16} color="#16a34a" aria-label="On today's menu" />
                            )}
                          </span>
                          <span className="col-name">
                            <div className="meal-cell">
                              {meal.image && (
                                <img
                                  src={meal.image}
                                  alt={meal.name}
                                  className="meal-thumb"
                                />
                              )}
                              <span>{meal.name}</span>
                            </div>
                          </span>
                          <span className="col-desc">
                            {meal.description || "—"}
                          </span>
                          <span className="col-price">
                            KSh {Number(meal.price || 0).toLocaleString()}
                          </span>
                          <span className="col-actions">
                            <button
                              className="action-btn action-edit"
                              onClick={() => handleEdit(meal)}
                              title="Edit meal"
                              aria-label={`Edit ${meal.name}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="action-btn action-delete"
                              onClick={() => handleDelete(meal)}
                              title="Delete meal"
                              aria-label={`Delete ${meal.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </span>
                        </div>
                      );
                    })}
                    {filteredMeals.length === 0 && (
                      <div className="table-empty">
                        <Search size={48} />
                        <p>No meals match your search.</p>
                      </div>
                    )}
                  </div>

                  <div className="table-pagination">
                    <span className="page-count">
                      Showing{" "}
                      {filteredMeals.length === 0
                        ? 0
                        : (menuPage - 1) * PAGE_SIZE + 1}
                      –
                      {Math.min(menuPage * PAGE_SIZE, filteredMeals.length)} of{" "}
                      {filteredMeals.length}
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
                </>
              ) : (
                mealStatus !== "loading" &&
                mealStatus !== "failed" && (
                  <div className="data-table">
                    <div className="table-empty">
                      <UtensilsCrossed size={48} />
                      <p>
                        No meals yet. Click &quot;Add Meal&quot; to create your
                        first one.
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="admin-content">
              <div className="admin-header">
                <div>
                  <h1>Today&apos;s Orders</h1>
                  <p className="admin-subtitle">
                    View incoming orders and update their status.
                  </p>
                </div>
              </div>

              {todaysOrders.length === 0 ? (
                <div className="data-table">
                  <div className="table-empty">
                    <ShoppingBag size={48} />
                    <p>No orders have come in today yet.</p>
                  </div>
                </div>
              ) : (
                <div className="orders-grid">
                  {todaysOrders.map((order) => {
                    const lines = orderLines(order);
                    const status =
                      order.status && STATUS_LABELS[order.status]
                        ? order.status
                        : order.status || "confirmed";
                    const badgeClass =
                      STATUS_BADGE_CLASS[status] || "";
                    return (
                      <div className="order-card" key={order.id ?? order.order_id}>
                        <div className="order-card-header">
                          <span className="order-card-id">
                            {order.id ?? order.order_id ?? "Order"}
                          </span>
                          <span className={`status-badge ${badgeClass}`}>
                            {STATUS_LABELS[status] || status}
                          </span>
                        </div>
                        <div className="order-card-meta">
                          <span>{orderCustomer(order)}</span>
                          <span>{formatTime(order.createdAt || order.date)}</span>
                        </div>
                        <div className="order-card-items">
                          {lines.length > 0 ? (
                            lines.map((line, i) => (
                              <div className="order-card-item" key={i}>
                                <span>
                                  {line.name}
                                  {Number(line.quantity) > 1
                                    ? ` ×${line.quantity}`
                                    : ""}
                                </span>
                                <span>
                                  KSh{" "}
                                  {(
                                    Number(line.price || 0) *
                                    Number(line.quantity || 1)
                                  ).toLocaleString()}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="order-card-item">
                              <span>Items</span>
                              <span>—</span>
                            </div>
                          )}
                        </div>
                        <div className="order-card-footer">
                          <span className="order-date">Total</span>
                          <span className="order-total">
                            KSh {orderTotal(order).toLocaleString()}
                          </span>
                        </div>
                        <div className="order-status-row">
                          <span className="order-status-label">Update status</span>
                          <select
                            className="order-status-select"
                            value={status}
                            disabled={updatingOrderId === (order.id ?? order.order_id)}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id ?? order.order_id,
                                e.target.value
                              )
                            }
                          >
                            {STATUS_ORDER.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
        </main>
      </div>
    </div>
  );
}

export default Admin;
