import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  apiGetTodaysMenu,
  apiListMealOptions,
  apiCreateOrder,
} from "../api";
import { useAuth } from "../context/AuthContext";

const DailyOptionsContext = createContext(null);

export function DailyOptionsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  /** Fetch today's published menu and resolve full meal option details. */
  const fetchDailyOptions = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const menuData = await apiGetTodaysMenu();
      const ids = menuData.mealOptionIds || [];

      if (ids.length === 0) {
        setOptions([]);
        setStatus("succeeded");
        return;
      }

      const allData = await apiListMealOptions();
      const allOptions = allData.mealOptions || [];
      const published = allOptions.filter((mo) => ids.includes(mo.id));
      setOptions(published);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  }, []);

  /** Place an order and return the created order object. */
  const placeOrder = async (selections) => {
    const mealOptionIds = Object.keys(selections).map(Number);
    const quantities = mealOptionIds.map((id) => selections[id]);

    const data = await apiCreateOrder({ mealOptionIds, quantities });
    const order = data.order;

    // Attach resolved meal names/quantities to the order for the confirmation screen
    const items = mealOptionIds.map((id, i) => {
      const option = options.find((o) => o.id === id);
      return {
        id,
        name: option?.name || `Meal #${id}`,
        price: option?.price || 0,
        quantity: quantities[i],
      };
    });

    const enrichedOrder = { ...order, items };
    setLastOrder(enrichedOrder);
    return enrichedOrder;
  };

  /** Clear the last order (e.g. when dismissing the confirmation). */
  const clearLastOrder = () => setLastOrder(null);

  // Fetch whenever authentication becomes available (on mount for an
  // already-logged-in session, and again on a fresh login/logout — the
  // provider itself never remounts across those, so without this the
  // very first, unauthenticated mount-time fetch would 401 and nothing
  // would ever retry once a token exists).
  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
      setError(null);
      setOptions([]);
      return;
    }
    void fetchDailyOptions();
  }, [isAuthenticated, fetchDailyOptions]);

  const value = {
    options,
    status,
    error,
    lastOrder,
    fetchDailyOptions,
    placeOrder,
    clearLastOrder,
  };

  return (
    <DailyOptionsContext.Provider value={value}>
      {children}
    </DailyOptionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDailyOptions() {
  const ctx = useContext(DailyOptionsContext);
  if (!ctx)
    throw new Error(
      "useDailyOptions must be used within DailyOptionsProvider"
    );
  return ctx;
}
