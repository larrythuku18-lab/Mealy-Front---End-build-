import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useDailyOptions } from "../../contexts/DailyOptionsContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import ReviewsModal from "../ReviewsModal/ReviewsModal";
import FoodIllustration from "../ui/FoodIllustration";
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
function CartModal({ cart, onConfirm, onClearSelection, onClose, isPlacing }) {
  const items = Object.values(cart);

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
function OrderConfirmation({ order, onContinue, onRate }) {
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
            <span className="order-confirm__item-name">
              {item.name}
              {onRate && (
                <button
                  type="button"
                  className="order-confirm__rate"
                  onClick={() => onRate({ id: item.id, name: item.name })}
                >
                  <Star size={11} />
                  Rate
                </button>
              )}
            </span>
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
    cart,
    addToCart,
    decrementCartItem,
    clearCart,
    placeOrder,
    lastOrder,
    clearLastOrder,
  } = useDailyOptions();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [cartOpen, setCartOpen] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [toast, setToast] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleClearSelection = () => {
    clearCart();
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
      await placeOrder();
      setCartOpen(false);
      showToast("Order placed successfully!", "success");
      // lastOrder will be set by context — the confirmation screen renders via `lastOrder`
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsPlacing(false);
    }
  };

  /* ── Derived values ────────────────────────────────────────────────────── */
  const cartItems = Object.values(cart);
  const selectedCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ── Render ────────────────────────────────────────────────────────────── */

  // Show order confirmation screen
  if (lastOrder) {
    return (
      <section className="daily-options">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <OrderConfirmation
          order={lastOrder}
          onContinue={() => {
            clearLastOrder();
          }}
          onRate={setReviewTarget}
        />
        {reviewTarget && (
          <ReviewsModal
            mealOption={reviewTarget}
            onClose={() => setReviewTarget(null)}
          />
        )}
      </section>
    );
  }

  return (
    <section className="daily-options">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading / error / empty states */}
      {status === "loading" && <p>Loading today's menu...</p>}
      {status === "idle" && (
        <p>
          <Link to="/login">Log in</Link> to see today's menu.
        </p>
      )}
      {status === "failed" && <p>Could not load today's menu.</p>}
      {status === "succeeded" && dailyOptions.length === 0 && (
        <div className="dmc-empty">
          <p>No meals have been published for today yet — check back later.</p>
        </div>
      )}

      {/* Meal option cards */}
      {dailyOptions.length > 0 && (
      <div className="dmc-grid">
        {dailyOptions.map((option) => {
          const qty = cart[option.id]?.quantity || 0;
          const favorited = isFavorite(option.id);
          return (
            <article
              key={option.id}
              className={`dmc-card ${qty > 0 ? "dmc-card--selected" : ""}`}
            >
              <div className="dmc-card-image">
                <button
                  type="button"
                  aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                  title={favorited ? "Remove from favorites" : "Add to favorites"}
                  className="dmc-favorite-toggle"
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
                  <FoodIllustration
                    name={option.name}
                    description={option.description}
                    className="dmc-card-image-placeholder"
                  />
                )}
              </div>
              <div className="dmc-card-body">
                <p className="dmc-card-name">{option.name}</p>
                <p className="dmc-card-description">{option.description}</p>
              </div>
              <div className="dmc-card-footer">
                <span className="dmc-card-price">
                  KSh {option.price.toLocaleString()}
                </span>
                {qty === 0 ? (
                  <button
                    type="button"
                    className="dmc-add-btn"
                    onClick={() => addToCart(option)}
                  >
                    Add Meal
                  </button>
                ) : (
                  <div className="dmc-stepper">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => decrementCartItem(option.id)}
                    >
                      −
                    </button>
                    <span className="dmc-qty">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => addToCart(option)}
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
      )}

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
          cart={cart}
          onConfirm={handleConfirmOrder}
          onClearSelection={handleClearSelection}
          onClose={() => setCartOpen(false)}
          isPlacing={isPlacing}
        />
      )}

      {/* Reviews modal */}
      {reviewTarget && (
        <ReviewsModal
          mealOption={reviewTarget}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </section>
  );
}

export default DailyMealOptionCard;
