import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { apiGetTodaysOrders } from "../api";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const fetchTodaysOrders = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiGetTodaysOrders();
      setItems(data.orders || []);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  }, []);

  const totalRevenue = useMemo(
    () => items.reduce((sum, order) => sum + (order.price || 0), 0),
    [items]
  );

  const value = { items, status, error, totalRevenue, fetchTodaysOrders };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
