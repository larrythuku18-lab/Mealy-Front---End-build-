import { useState } from "react";
import { useDailyOptions } from "../../contexts/DailyOptionsContext";
import "./DailyMealOptionCard.css";

function DailyMealOptionCard() {
  const { options: dailyOptions, status, placeOrder } = useDailyOptions();
  const [selections, setSelections] = useState({});
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handlePlaceOrder = async () => {
    setOrderPlacing(true);
    try {
      await placeOrder(selections);
      setSelections({});
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setOrderPlacing(false);
    }
  };

  const selectedCount = Object.values(selections).reduce((a, b) => a + b, 0);
  const selectedTotal = dailyOptions
    .filter((o) => selections[o.id])
    .reduce((sum, o) => sum + o.price * selections[o.id], 0);

  return (
    <section className="daily-options">
      <h2>Daily Options</h2>

      {status === "loading" && <p>Loading today's menu...</p>}
      {status === "failed" && <p>Could not load today's menu.</p>}

      {orderSuccess && (
        <p style={{ color: "#16a34a", fontWeight: 600 }}>
          ✓ Order placed successfully!
        </p>
      )}

      <div className="daily-options-grid">
        {dailyOptions.map((option) => {
          const qty = selections[option.id] || 0;
          return (
            <article
              key={option.id}
              className={`daily-option ${qty > 0 ? "selected" : ""}`}
            >
              <div className="daily-option-body">
                <p className="meal-name">{option.name}</p>
                <p className="meal-description">{option.description}</p>
              </div>
              <div className="daily-option-footer">
                <span className="meal-price">
                  KSh {option.price.toLocaleString()}
                </span>
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
        })}
      </div>

      {selectedCount > 0 && (
        <div className="current-choice">
          <div className="current-choice-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="current-choice-body">
            <span className="label">
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </span>
            <span className="subtotal">
              Subtotal: KSh {selectedTotal.toLocaleString()}
            </span>
          </div>
          <button
            className="btn-primary btn-primary--inline"
            onClick={handlePlaceOrder}
            disabled={orderPlacing}
          >
            {orderPlacing ? "Placing..." : "Confirm & Place Order"}
          </button>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="cart-float">
          <div className="cart-float-info">
            <span className="cart-float-count">
              {selectedCount} item{selectedCount > 1 ? "s" : ""}
            </span>
            <span className="cart-float-total">
              KSh {selectedTotal.toLocaleString()}
            </span>
          </div>
          <button
            className="btn-primary btn-primary--inline cart-float-btn"
            onClick={handlePlaceOrder}
            disabled={orderPlacing}
          >
            {orderPlacing ? "Placing..." : "Place Order"}
          </button>
        </div>
      )}
    </section>
  );
}

export default DailyMealOptionCard;
