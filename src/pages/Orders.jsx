import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar/Navbar";
import OrderHistoryCard from "../components/OrderHistoryCard/OrderHistoryCard";
import { useAuth } from "../context/AuthContext";
import { apiListOrders } from "../api";
import "./Orders.css";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await apiListOrders();
        setOrders(data.orders || []);
      } catch {
        // Silently fail — show empty state
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== "delivered"),
    [orders]
  );
  const pastOrders = useMemo(
    () => orders.filter((o) => o.status === "delivered"),
    [orders]
  );
  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total || 0), 0),
    [orders]
  );

  return (
    <div className="page">
      <Navbar user={user} />
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p>Track your current orders and view history</p>
          </div>

          <div className="orders-stats">
            <div className="o-stat-card">
              <span className="o-stat-number">{orders.length}</span>
              <span className="o-stat-label">Total Orders</span>
            </div>
            <div className="o-stat-card">
              <span className="o-stat-number">{activeOrders.length}</span>
              <span className="o-stat-label">Active</span>
            </div>
            <div className="o-stat-card">
              <span className="o-stat-number">{pastOrders.length}</span>
              <span className="o-stat-label">Delivered</span>
            </div>
            <div className="o-stat-card">
              <span className="o-stat-number">
                KSh {totalSpent.toLocaleString()}
              </span>
              <span className="o-stat-label">Total Spent</span>
            </div>
          </div>

          {loading && <p>Loading orders...</p>}

          {!loading && activeOrders.length > 0 && (
            <section className="orders-section">
              <div className="orders-section-header">
                <h2>Active Orders</h2>
                <span className="orders-section-count">
                  {activeOrders.length}
                </span>
              </div>
              <div className="orders-list">
                {activeOrders.map((order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          {!loading && pastOrders.length > 0 && (
            <section className="orders-section">
              <div className="orders-section-header">
                <h2>Past Orders</h2>
                <span className="orders-section-count">
                  {pastOrders.length}
                </span>
              </div>
              <div className="orders-list">
                {pastOrders.map((order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          {!loading && orders.length === 0 && (
            <div className="orders-empty">
              <div className="orders-empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                </svg>
              </div>
              <h3>No orders yet</h3>
              <p>When you place an order, it will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;
