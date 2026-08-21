import Navbar from "../components/Navbar/Navbar";
import { meals, currentUser } from "../data/mockData";
import "./Admin.css";

function Admin() {
  const totalMeals = meals.length;
  const availableMeals = meals.filter((m) => m.available).length;

  return (
    <div className="page">
      <Navbar user={{ ...currentUser, role: "admin" }} />
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Manage meals, orders, and menu settings</p>
          </div>

          <div className="admin-stats">
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
            <div className="stat-card">
              <span className="stat-number">6</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>

          <section className="admin-section">
            <div className="admin-section-header">
              <h2>Meal Options</h2>
              <button className="btn-primary btn-primary--inline">+ Add Meal</button>
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
                  <span className="col-price">KSh {meal.price.toFixed(2)}</span>
                  <span className={`col-status ${meal.available ? "active" : "inactive"}`}>
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
