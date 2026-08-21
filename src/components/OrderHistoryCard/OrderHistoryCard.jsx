import "./OrderHistoryCard.css";

const statusSteps = ["confirmed", "preparing", "in_transit", "delivered"];

const statusLabels = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  in_transit: "In Transit",
  delivered: "Delivered",
};

function OrderHistoryCard({ order }) {
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <span className="order-id">{order.id}</span>
          <span className="order-date">{order.date}</span>
        </div>
        <span className={`order-status order-status--${order.status}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="order-progress">
        {statusSteps.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${index <= currentStepIndex ? "completed" : ""} ${
              index === currentStepIndex ? "current" : ""
            }`}
          >
            <div className="progress-dot" />
            <span className="progress-label">{statusLabels[step]}</span>
          </div>
        ))}
      </div>

      <div className="order-card-items">
        {order.meals.map((meal, index) => (
          <div key={index} className="order-item">
            <img src={meal.image} alt={meal.name} className="order-item-img" />
            <div className="order-item-info">
              <span className="order-item-name">{meal.name}</span>
              <span className="order-item-qty">Qty: {meal.quantity}</span>
            </div>
            <span className="order-item-price">
              ${(meal.price * meal.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <span className="order-total-label">Total</span>
        <span className="order-total">${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderHistoryCard;
