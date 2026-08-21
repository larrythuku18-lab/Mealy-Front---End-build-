import Navbar from "../components/Navbar/Navbar";
import OrderHistoryCard from "../components/OrderHistoryCard/OrderHistoryCard";
import { initialOrders, currentUser } from "../data/mockData";
import "./Orders.css";

function Orders() {
  const activeOrders = initialOrders.filter((o) => o.status !== "delivered");
  const pastOrders = initialOrders.filter((o) => o.status === "delivered");

  return (
    <div className="page">
      <Navbar user={currentUser} />
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p>Track your current orders and view history</p>
          </div>

          {activeOrders.length > 0 && (
            <section className="orders-section">
              <h2>Active Orders</h2>
              <div className="orders-list">
                {activeOrders.map((order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          {pastOrders.length > 0 && (
            <section className="orders-section">
              <h2>Past Orders</h2>
              <div className="orders-list">
                {pastOrders.map((order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          {initialOrders.length === 0 && (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;
