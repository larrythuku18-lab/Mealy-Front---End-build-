import { useState } from "react";
import { useDailyOptions } from "../../contexts/DailyOptionsContext";
import "./DailyMealOptions.css";
import MealOptionCard from "../MealOptionCard/MealOptionCard";

function DailyMealOptions() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { options: dailyOptions } = useDailyOptions();
  const [selections, setSelections] = useState({}); // Track card selection state

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const selectedCount = Object.values(selections).reduce((a, b) => a + b, 0);
  const selectedTotal = dailyOptions
    .filter((o) => selections[o.id])
    .reduce((sum, o) => sum + o.price * selections[o.id], 0);

  function handleAddToCart() {
    // Try to submit to Real API cart endpoint
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2500);

    // Check if submission was successful
    setAddedToCart(true);
    setTimeout(() => setIsLeaving(true), 5500);

    setTimeout(() => setAddedToCart(false), 6000);
    setTimeout(() => setIsLeaving(false), 6500);
  }

  return (
    <section className="daily-options">
      <div className="menu-header">
        <span className="eyebrow">Today's Selection</span>
        <h1>{dateStr}</h1>
      </div>
      <div className="daily-options-grid">
        {dailyOptions.map((option) => {
          const qty = selections[option.id] || 0;
          return (
            <MealOptionCard
              key={option.id}
              option={option}
              qty={qty}
              setSelections={setSelections}
            />
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className={`cart-float ${isLeaving ? "is-leaving" : ""}`}>
          <div className="cart-float-info">
            <span className="cart-float-count">
              {selectedCount} item{selectedCount > 1 ? "s" : ""}
            </span>
            <span className="cart-float-total">
              KSh {selectedTotal.toLocaleString()}
            </span>
          </div>
          <button
            className={`btn-primary btn-primary--inline cart-float-btn ${!isSubmitting && addedToCart ? "is-success" : ""}`}
            onClick={() => handleAddToCart()}
          >
            {isSubmitting
              ? "Adding..."
              : addedToCart
                ? "Added successfully!"
                : "Add to cart"}
          </button>
        </div>
      )}
    </section>
  );
}

export default DailyMealOptions;
