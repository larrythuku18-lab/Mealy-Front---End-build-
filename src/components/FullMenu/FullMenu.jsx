import { useState } from "react";
import { meals, categories } from "../../data/mockData";
import "./FullMenu.css";
import MealOptionCard from "../MealOptionCard/MealOptionCard";
import { ChevronDown } from "lucide-react";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

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
<<<<<<< HEAD
      <div>
        <div>
          <div className="category-bar">
            {categories.map((cat) =>
              activeCategory === cat.name ? (
                <Btn
                  key={cat.id}
                  title={`${cat.name} category button`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.name}
                </Btn>
              ) : (
                <Btn
                  key={cat.id}
                  title={`${cat.name} category button`}
                  variant="secondary"
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.name}
                </Btn>
              ),
            )}
=======
      <div className="filter-search-wrapper">
        <div className="filters">
          <div className="category-bar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                title={`${cat.name} category button`}
                onClick={() => setActiveCategory(cat.name)}
                className={`category-btn ${activeCategory === cat.name ? "is-active" : ""}`}
              >
                <img src={cat.icon} />
                {cat.name}
              </button>
            ))}
>>>>>>> origin/dev
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
          <Input
            labelExists={false}
            title="Search meals input"
            id="search-meals"
            placeholder="Search meals..."
          />
          <Btn title="Search meals button" type="submit">
            Search
          </Btn>
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
