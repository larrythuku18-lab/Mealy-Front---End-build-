import "./OrderHistoryCard.css";

function OrderHistoryCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-card-meals">
        {order.meals.map((meal, index) => (
          <div key={index} className="meal-line">
            <img src={meal.image} alt={meal.name} className="meal-thumb" />
            <div className="meal-info">
              <span className="name">
                {meal.quantity}x - {meal.name}
              </span>
              <span className="price">
                KSh {(meal.price * meal.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="order-card-meta">
        <span className={`status-badge status-badge--${order.status}`}>
          {order.status.replace("_", " ")}
        </span>
        <span className="order-subtotal">
          Total: KSh {order.total.toLocaleString()}
        </span>
        <span className="order-date">{order.date}</span>
      </div>
    </div>
  );
}

export default OrderHistoryCard;
