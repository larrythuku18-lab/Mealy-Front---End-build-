import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import DailyMealOptionCard from "../components/DailyMealOptionCard/DailyMealOptionCard";
import OrderHistoryCard from "../components/OrderHistoryCard/OrderHistoryCard";
import { meals, categories, currentUser, initialOrders } from "../data/mockData";
import "./Menu.css";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMeals =
    activeCategory === "All"
      ? meals
      : meals.filter((meal) => meal.category === activeCategory);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page">
      <Navbar user={currentUser} />
      <main className="menu-main">
        <div className="menu-header">
          <span className="eyebrow">Today's Selection</span>
          <h1>{dateStr}</h1>
        </div>

        <DailyMealOptionCard />

        <section className="full-menu">
          <h2>Full Menu</h2>
          <div className="category-bar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.name ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="meal-grid">
            {filteredMeals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <div className="meal-card-image">
                  <img src={meal.image} alt={meal.name} />
                  {!meal.available && (
                    <div className="meal-card-overlay">Unavailable</div>
                  )}
                </div>
                <div className="meal-card-body">
                  <h3 className="meal-card-name">{meal.name}</h3>
                  <p className="meal-card-desc">{meal.description}</p>
                  <div className="meal-card-footer">
                    <span className="meal-card-price">
                      KSh {meal.price.toLocaleString()}
                    </span>
                    {meal.available && (
                      <button className="btn-primary btn-primary--inline">
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="empty-state">
              <p>No meals available in this category.</p>
            </div>
          )}
        </section>

        <section className="order-history">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {initialOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Menu;
