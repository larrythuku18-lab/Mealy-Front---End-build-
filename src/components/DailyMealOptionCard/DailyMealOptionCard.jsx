import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyOptions } from "../../contexts/DailyOptionsContext";
import { useAuth } from "../../context/AuthContext";
import "./DailyMealOptionCard.css";

/* ─── Toast ─────────────────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  return (
    <div className={`toast toast--${type}`}>
      <span>{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}

/* ─── Cart Review Modal ─────────────────────────────────────────────────────── */
function CartModal({
  selections,
  dailyOptions,
  onConfirm,
  onClearSelection,
  onClose,
  isPlacing,
}) {
  const items = Object.entries(selections)
    .map(([id, qty]) => {
      const option = dailyOptions.find((o) => o.id === Number(id));
      return option ? { ...option, quantity: qty } : null;
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal__header">
          <h2>Your Cart</h2>
          <button className="cart-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="cart-modal__items">
          {items.map((item) => (
            <div key={item.id} className="cart-modal__item">
              <div className="cart-modal__item-info">
                <span className="cart-modal__item-name">{item.name}</span>
                <span className="cart-modal__item-unit-price">
                  KSh {item.price.toLocaleString()} each
                </span>
              </div>
              <div className="cart-modal__item-right">
                <span className="cart-modal__item-qty">×{item.quantity}</span>
                <span className="cart-modal__item-subtotal">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-modal__footer">
          <div className="cart-modal__summary">
            <div className="cart-modal__summary-row">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="cart-modal__summary-row cart-modal__summary-row--total">
              <span>Total</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="cart-modal__actions">
            <button
              className="cart-modal__btn cart-modal__btn--secondary"
              onClick={onClearSelection}
            >
              Clear Cart
            </button>
            <button
              className="cart-modal__btn cart-modal__btn--primary"
              onClick={onConfirm}
              disabled={isPlacing}
            >
              {isPlacing ? (
                <span className="cart-modal__spinner" />
              ) : (
                "Confirm & Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Order Confirmation Screen ─────────────────────────────────────────────── */
function OrderConfirmation({ order, onContinue }) {
  return (
    <div className="order-confirm">
      <div className="order-confirm__icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h2 className="order-confirm__title">Order Placed!</h2>
      <p className="order-confirm__subtitle">
        Your order <strong>{order.id}</strong> has been confirmed.
      </p>

      <div className="order-confirm__details">
        {order.items.map((item, i) => (
          <div key={i} className="order-confirm__item">
            <span>{item.name}</span>
            <span>
              ×{item.quantity} — KSh{" "}
              {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="order-confirm__total">
          <span>Total</span>
          <span>KSh {(order.total || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="order-confirm__status">
        <span className="order-confirm__badge">Confirmed</span>
        <span className="order-confirm__status-text">
          Your caterer will start preparing shortly.
        </span>
      </div>

      <button className="order-confirm__btn" onClick={onContinue}>
        Continue Ordering
      </button>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
function DailyMealOptionCard() {
  const navigate = useNavigate();
  const {
    options: dailyOptions,
    status,
    placeOrder,
    lastOrder,
    clearLastOrder,
  } = useDailyOptions();
  const { isAuthenticated } = useAuth();

  const [selections, setSelections] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Quantity controls ─────────────────────────────────────────────────── */
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

  const handleRemoveItem = (optionId) => {
    setSelections((prev) => {
      const { [optionId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleClearSelection = () => {
    setSelections({});
    setCartOpen(false);
  };

  /* ── Order placement ───────────────────────────────────────────────────── */
  const handleOpenCart = () => {
    if (!isAuthenticated) {
      showToast("Please log in to place an order", "error");
      navigate("/login");
      return;
    }
    setCartOpen(true);
  };

  const handleConfirmOrder = async () => {
    setIsPlacing(true);
    try {
      await placeOrder(selections);
      setSelections({});
      setCartOpen(false);
      // lastOrder will be set by context — the confirmation screen renders via `lastOrder`
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsPlacing(false);
    }
  };

  /* ── Derived values ────────────────────────────────────────────────────── */
  const selectedCount = Object.values(selections).reduce((a, b) => a + b, 0);
  const selectedTotal = dailyOptions
    .filter((o) => selections[o.id])
    .reduce((sum, o) => sum + o.price * selections[o.id], 0);

  /* ── Render ────────────────────────────────────────────────────────────── */

  // Show order confirmation screen
  if (lastOrder) {
    return (
      <section className="daily-options">
        <OrderConfirmation
          order={lastOrder}
          onContinue={() => {
            clearLastOrder();
          }}
        />
      </section>
    );
  }

  return (
    <section className="daily-options">
      <h2>Daily Options</h2>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading / error states */}
      {status === "loading" && <p>Loading today's menu...</p>}
      {status === "failed" && <p>Could not load today's menu.</p>}

      {/* Meal option cards */}
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

      {/* Inline selection summary */}
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
            onClick={handleOpenCart}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Floating cart bar */}
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
            onClick={handleOpenCart}
          >
            View Cart
          </button>
        </div>
      )}

      {/* Cart review modal */}
      {cartOpen && (
        <CartModal
          selections={selections}
          dailyOptions={dailyOptions}
          onConfirm={handleConfirmOrder}
          onClearSelection={handleClearSelection}
          onClose={() => setCartOpen(false)}
          isPlacing={isPlacing}
        />
      )}
    </section>
  );
}

export default DailyMealOptionCard;
