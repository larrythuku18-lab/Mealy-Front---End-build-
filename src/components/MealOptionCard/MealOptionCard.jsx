import Btn from "../ui/Btn";
import "./MealOptionCard.css";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

function MealOptionCard({ option, qty, setSelections }) {
  const [isHovered, setIsHovered] = useState(false);
  const handleAdd = (optionId) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1,
    }));
  };

  const handleDecrease = (optionId) => {
    setSelections((prev) => {
      const current = prev[optionId] || 0;
      if (current <= 1) {
        // eslint-disable-next-line no-unused-vars
        const { [optionId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [optionId]: current - 1 };
    });
  };

  return (
    <article
      key={option.id}
      className={`daily-option ${qty > 0 ? "selected" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="daily-option-image">
        <Heart
          aria-label="Add to favorites"
          className={`favorite-icon ${isHovered ? "" : "hidden"}`}
          color="white"
        />
        <img src={option.image} alt={option.name} />
      </div>
      <div className="daily-option-body">
        <p className="meal-name">{option.name}</p>
        <p className="meal-description">{option.description}</p>
      </div>
      <div className="daily-option-footer">
        <div className="daily-option-footer-l">
          <span className="meal-price">
            KSh {option.price.toLocaleString()}
          </span>
          <div className="meal-rating">
            <Star size={12} strokeWidth={2.5} />
            <p>{option.rating}</p>
          </div>
        </div>
        {qty === 0 ? (
          <Btn
            type="button"
            title="Add meal button"
            variant="tertiary"
            onClick={() => handleAdd(option.id)}
          >
            Add Meal
          </Btn>
        ) : (
          <div className="quantity-stepper">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => handleDecrease(option.id)}
            >
              −
            </button>
            <span className="qty-value">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => handleAdd(option.id)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default MealOptionCard;
