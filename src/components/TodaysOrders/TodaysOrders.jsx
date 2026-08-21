import { useEffect } from "react";
import { useOrders } from "../../context/OrdersContext";
import "./TodaysOrders.css";

const formatKes = (amount) => `Kes. ${amount.toLocaleString()}`;

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });


function TodaysOrders() {
  const { items: orders, status, totalRevenue, fetchTodaysOrders } = useOrders();

  useEffect(() => {
    fetchTodaysOrders();
   
  }, []);

  return (
    <section className="todays-orders">
      <h2>Today's Orders</h2>

      {status === "loading" && <p>Loading orders...</p>}
      {status === "failed" && <p className="todays-orders__error">Could not load today's orders.</p>}
      {status !== "loading" && orders.length === 0 && <p>No orders yet today.</p>}

      {orders.length > 0 && (
        <table className="todays-orders__table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Meal Chosen</th>
              <th>Order Time</th>
              <th className="todays-orders__price-col">Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="todays-orders__customer">{order.customerName}</td>
                <td>{order.mealOptionName}</td>
                <td className="todays-orders__time">{formatTime(order.createdAt)}</td>
                <td className="todays-orders__price-col">{formatKes(order.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="todays-orders__total-label">Total Orders: {orders.length}</td>
              <td />
              <td />
              <td className="todays-orders__price-col todays-orders__total-revenue">
                Total Revenue: {formatKes(totalRevenue)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
}

export default TodaysOrders;
