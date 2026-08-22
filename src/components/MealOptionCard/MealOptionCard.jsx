import "./MealOptionCard.css";

function MealOptionCard({ option, qty, setSelections }) {
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
    >
      <div className="daily-option-image">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
            </svg>
            <p>{option.rating}</p>
          </div>
        </div>
        {qty === 0 ? (
          <button
            type="button"
            className="add-meal-btn"
            onClick={() => handleAdd(option.id)}
          >
            Add Meal
          </button>
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
