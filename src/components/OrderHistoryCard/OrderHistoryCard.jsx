import "./OrderHistoryCard.css";

function OrderHistoryCard() {
  return (
    <section className="order-history">
      <h2>Order History</h2>

      <div className="order-card">
        <div className="meal-line">
          <span className="name">1x - Beef with Rice</span>
          <span className="price">Kes. 750</span>
        </div>
        <div className="order-status">
          <span className="status-badge">Pending</span>
          <span className="order-subtotal">Subtotal: Kes. 750</span>
        </div>
      </div>

      <div className="order-card">
        <div>
          <div className="meal-line">
            <span className="name">1x - Beef with Rice</span>
            <span className="price">Kes. 750</span>
          </div>
          <div className="meal-line">
            <span className="name">2x - Chicken with Fries</span>
            <span className="price">Kes. 2,100</span>
          </div>
        </div>
        <div className="order-status">
          <span className="status-badge">Delivered</span>
          <span className="order-subtotal">Subtotal: Kes. 2,850</span>
        </div>
      </div>

      <div className="order-card">
        <div className="meal-line">
          <span className="name">1x - Veggie Pasta</span>
          <span className="price">Kes. 1,200</span>
        </div>
        <div className="order-status">
          <span className="status-badge">Delivered</span>
          <span className="order-subtotal">Subtotal: Kes. 2,850</span>
        </div>
      </div>
    </section>
  );
}

export default OrderHistoryCard;
