import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import DailyMealOptionCard from "../components/DailyMealOptionCard/DailyMealOptionCard";
import { meals, categories, currentUser } from "../data/mockData";
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
                {cat.name}
              </button>
            ))}
          </div>

          {filteredMeals.length > 0 ? (
            <div className="meal-list">
              {filteredMeals.map((meal) => (
                <div key={meal.id} className="meal-row">
                  <div className="meal-row-img">
                    <img src={meal.image} alt={meal.name} />
                  </div>
                  <div className="meal-row-info">
                    <div className="meal-row-top">
                      <span className="meal-row-name">{meal.name}</span>
                      <span className="category-tag">{meal.category}</span>
                    </div>
                    <p className="meal-row-desc">{meal.description}</p>
                  </div>
                  <div className="meal-row-right">
                    <span className="meal-row-price">
                      KSh {meal.price.toLocaleString()}
                    </span>
                    {meal.available ? (
                      <button className="btn-add">+ Add</button>
                    ) : (
                      <span className="unavailable-label">Unavailable</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No meals available in this category.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Menu;
