import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import DailyMealOptionCard from "../components/DailyMealOptionCard/DailyMealOptionCard";
import { meals, categories, currentUser } from "../data/mockData";
import "./Menu.css";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredMeals =
    activeCategory === "All"
      ? meals
      : meals.filter((meal) => meal.category === activeCategory);

  const handleAddToOrder = (meal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page">
      <Navbar user={currentUser} />
      <main className="menu-page">
        <div className="menu-container">
          <div className="menu-header">
            <h1>Today's Menu</h1>
            <p>Fresh meals prepared daily. Pick your favorites!</p>
          </div>

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
              <DailyMealOptionCard key={meal.id} meal={meal} onAddToOrder={handleAddToOrder} />
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="empty-state">
              <p>No meals available in this category.</p>
            </div>
          )}
        </div>

        {cartCount > 0 && (
          <div className="cart-float">
            <span className="cart-count">{cartCount} item(s)</span>
            <span className="cart-total">
              ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </span>
            <button className="btn-primary btn-primary--inline">Order Now</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Menu;
