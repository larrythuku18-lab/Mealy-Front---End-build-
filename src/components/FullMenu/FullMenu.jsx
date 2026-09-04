import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiListCategories, apiListMealOptions } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useDailyOptions } from "../../contexts/DailyOptionsContext";
import { prefetchFoodImages } from "../../utils/pexelsImages";
import "./FullMenu.css";
import MealOptionCard from "../MealOptionCard/MealOptionCard";
import { ChevronDown } from "lucide-react";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

/** Meal options may hold a single category string or an array. */
function toCategoryList(option) {
  const cat = option?.category;
  if (!cat) return [];
  return Array.isArray(cat) ? cat : [cat];
}

function FullMenu() {
  const { isAuthenticated } = useAuth();
  const { cart, addToCart, decrementCartItem } = useDailyOptions();
  const [activeCategory, setActiveCategory] = useState("All");
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingSort, setRatingSort] = useState("");
  const [priceSort, setPriceSort] = useState("");

  // Meal options require auth on the backend. This component fetches once
  // per mount and doesn't remount across login/logout, so without tying
  // the fetch to isAuthenticated, a stale/invalid token on first load (or
  // simply loading the page logged out) would fail once and never retry
  // even after a successful login.
  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unauthenticated");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    Promise.all([apiListMealOptions(), apiListCategories()])
      .then(([mealsData, catsData]) => {
        if (cancelled) return;
        const mealList = mealsData.mealOptions || [];
        setMeals(mealList);
        prefetchFoodImages(mealList);
        const cats = (catsData.categories || []).filter((cat) => cat && cat.name);
        setCategories([{ id: 0, name: "All" }, ...cats]);
        setStatus("succeeded");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const filteredMeals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const byCategory =
      activeCategory === "All"
        ? meals
        : meals.filter((meal) => toCategoryList(meal).includes(activeCategory));

    const byQuery = query
      ? byCategory.filter((meal) =>
          [meal.name, meal.description, ...toCategoryList(meal)]
            .filter(Boolean)
            .some((text) => text.toLowerCase().includes(query))
        )
      : byCategory;

    const direction = (value) => (value === "desc" ? -1 : 1);

    return [...byQuery].sort((a, b) => {
      if (ratingSort) {
        const diff =
          (Number(a.rating) || 0) - (Number(b.rating) || 0);
        if (diff !== 0) return diff * direction(ratingSort);
      }
      if (priceSort) {
        const diff =
          (Number(a.price) || 0) - (Number(b.price) || 0);
        if (diff !== 0) return diff * direction(priceSort);
      }
      return 0;
    });
  }, [meals, activeCategory, searchQuery, ratingSort, priceSort]);

  return (
    <section className="full-menu">
      <h2>Full Menu</h2>

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
                {cat.icon && <img src={cat.icon} alt="" />}
                {cat.name}
              </button>
            ))}
          </div>
          <div className="sort-bar">
            <div className="select-wrapper">
              <select
                aria-label="Sort by rating"
                value={ratingSort}
                onChange={(e) => setRatingSort(e.target.value)}
              >
                <option value="">Rating</option>
                <option value="asc">Rating: Low to High</option>
                <option value="desc">Rating: High to Low</option>
              </select>
              <ChevronDown className="select-icon" />
            </div>
            <div className="select-wrapper">
              <select
                aria-label="Sort by price"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="">Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Btn
            title="Clear search"
            type="button"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </Btn>
        </div>
      </div>

      {status === "loading" && <p>Loading menu...</p>}
      {status === "unauthenticated" && (
        <div className="empty-state">
          <p>
            <Link to="/login">Log in</Link> to see the menu.
          </p>
        </div>
      )}
      {status === "failed" && (
        <div className="empty-state">
          <p>Could not load the menu. Please try again later.</p>
        </div>
      )}
      {status === "succeeded" && meals.length === 0 && (
        <div className="empty-state">
          <p>No meals in the menu yet. Check back soon!</p>
        </div>
      )}

      {status === "succeeded" && meals.length > 0 && (
        <>
          {filteredMeals.length > 0 ? (
            <div className="meal-list">
              {filteredMeals.map((meal) => (
                <MealOptionCard
                  key={meal.id}
                  option={meal}
                  qty={cart[meal.id]?.quantity || 0}
                  onAdd={addToCart}
                  onDecrease={decrementCartItem}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No meals match your search or filters.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default FullMenu;