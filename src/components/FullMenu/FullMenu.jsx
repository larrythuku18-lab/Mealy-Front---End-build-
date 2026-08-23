import { useState } from "react";
import { meals, categories } from "../../data/mockData";
import "./FullMenu.css";
import MealOptionCard from "../MealOptionCard/MealOptionCard";
import { ChevronDown } from "lucide-react";

function FullMenu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selections, setSelections] = useState({});

  const filteredMeals =
    activeCategory === "All"
      ? meals
      : meals.filter((meal) => meal.category.includes(activeCategory));

  return (
    <section className="full-menu">
      <h2>Full Menu</h2>
      <div>
        <div>
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
          <div className="sort-bar">
            <div className="select-wrapper">
              <select>
                <option>Rating</option>
                <option>Ascending</option>
                <option>Descending</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
            <div className="select-wrapper">
              <select>
                <option>Price</option>
                <option>Ascending</option>
                <option>Descending</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
          </div>
        </div>
        <div className="search-bar">
          <input placeholder="Search meals..." />
          <button>Search</button>
        </div>
      </div>

      {filteredMeals.length > 0 ? (
        <div className="meal-list">
          {filteredMeals.map((meal) => (
            <MealOptionCard
              key={meal.id}
              option={meal}
              qty={selections[meal.id] || 0}
              setSelections={setSelections}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No meals available in this category.</p>
        </div>
      )}
    </section>
  );
}

export default FullMenu;
