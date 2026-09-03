import Btn from "../ui/Btn";
import "./MealOptionCard.css";
import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "../../context/FavoritesContext";
import ReviewsModal from "../ReviewsModal/ReviewsModal";
import MealRating from "../MealRating/MealRating";

function MealOptionCard({ option, qty, setSelections }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const favorited = isFavorite(option.id);
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
        <button
          type="button"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
          className={`favorite-toggle ${isHovered || favorited ? "" : "favorite-toggle--hidden"}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(option);
          }}
        >
          <Heart
            size={18}
            color={favorited ? "#ef4444" : "white"}
            fill={favorited ? "#ef4444" : "none"}
          />
        </button>
        {option.image ? (
          <img src={option.image} alt={option.name} />
        ) : (
          <div className="daily-option-image-placeholder" />
        )}
      </div>
      <div className="daily-option-body">
        <p className="meal-name">{option.name}</p>
        <p className="meal-description">{option.description}</p>
      </div>
      <div className="daily-option-footer">
        <div className="daily-option-footer-l">
          <span className="meal-price">
            KSh {Number(option.price || 0).toLocaleString()}
          </span>
          <MealRating mealId={option.id} />
          <button
            type="button"
            className="review-link"
            title="Read and write reviews"
            aria-label={`Reviews for ${option.name}`}
            onClick={() => setShowReviews(true)}
          >
            <MessageSquare size={13} />
            Reviews
          </button>
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
      {showReviews && (
        <ReviewsModal
          mealOption={option}
          onClose={() => setShowReviews(false)}
        />
      )}
    </article>
  );
}

export default MealOptionCard;
