import { createContext, useContext, useMemo, useState } from "react";

const OrdersContext = createContext(null);


const todayAt = (hours, minutes) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const DEMO_ORDERS = [
  { id: 1, customerName: "kev mwangi", mealOptionName: "Beef with Rice", price: 750, createdAt: todayAt(10, 14) },
  { id: 2, customerName: "Eugene Gaitano", mealOptionName: "Chicken with Fries", price: 1050, createdAt: todayAt(10, 30) },
  { id: 3, customerName: "Larry Thuku", mealOptionName: "Beef with Rice", price: 750, createdAt: todayAt(10, 45) },
  { id: 4, customerName: "Joy Mwongera", mealOptionName: "Veggie Pasta", price: 1200, createdAt: todayAt(11, 2) },
];


 
export function OrdersProvider({ children }) {
 
  const [items, setItems] = useState(DEMO_ORDERS);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "failed"
  const [error, setError] = useState(null);

  const fetchTodaysOrders = async () => {
    setStatus("loading");
    setError(null);
    try {
      
      setStatus("idle"); 
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  };

  const totalRevenue = useMemo(
    () => items.reduce((sum, order) => sum + order.price, 0),
    [items]
  );

  const value = { items, status, error, totalRevenue, fetchTodaysOrders };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}


export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
