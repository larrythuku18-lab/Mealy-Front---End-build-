import "./OrderHistoryCard.css";

const statusSteps = ["confirmed", "preparing", "in_transit", "delivered"];

const statusLabels = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  in_transit: "In Transit",
  delivered: "Delivered",
};

function OrderHistoryCard({ order }) {
  const currentStep = statusSteps.indexOf(order.status);
  const progress = ((currentStep + 1) / statusSteps.length) * 100;

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-card-id-group">
          <span className="order-id">{order.id}</span>
          <span className="order-date">{order.date}</span>
        </div>
        <span className={`status-badge status-badge--${order.status}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="order-progress-bar">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-steps">
          {statusSteps.map((step, i) => (
            <span
              key={step}
              className={`progress-step ${i <= currentStep ? "active" : ""}`}
            >
              {statusLabels[step]}
            </span>
          ))}
        </div>
      </div>

      <div className="order-card-items">
        {order.meals.map((meal, index) => (
          <div key={index} className="order-item">
            {meal.image ? (
              <img src={meal.image} alt={meal.name} className="order-item-img" />
            ) : (
              <div className="order-item-img order-item-img--placeholder">
                {meal.name?.charAt(0) || '?'}
              </div>
            )}
            <div className="order-item-info">
              <span className="order-item-name">{meal.name}</span>
              <span className="order-item-qty">Qty: {meal.quantity}</span>
            </div>
            <span className="order-item-price">
              KSh {(meal.price * meal.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <div className="order-footer-left">
          <span className="order-items-count">
            {order.meals.reduce((sum, m) => sum + m.quantity, 0)} item
            {order.meals.reduce((sum, m) => sum + m.quantity, 0) > 1 ? "s" : ""}
          </span>
        </div>
        <div className="order-footer-right">
          <span className="order-total-label">Total</span>
          <span className="order-total">KSh {order.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryCard;
