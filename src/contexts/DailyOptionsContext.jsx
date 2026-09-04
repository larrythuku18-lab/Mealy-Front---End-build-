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
import { prefetchFoodImages } from "../utils/pexelsImages";

const DailyOptionsContext = createContext(null);

export function DailyOptionsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // Shared cart for both the Today's Selection and Full Menu sections, so
  // items picked from either combine into one order. Keyed by meal option
  // id; each entry carries the meal's own details (not just an id) so the
  // cart/checkout UI can display Full Menu items too, which aren't part of
  // `options` above (that list is scoped to today's published subset).
  const [cart, setCart] = useState({});

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
      prefetchFoodImages(published);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  }, []);

  /** Add one of a meal option to the cart (or increment if already there). */
  const addToCart = useCallback((option) => {
    setCart((prev) => {
      const existing = prev[option.id];
      return {
        ...prev,
        [option.id]: {
          id: option.id,
          name: option.name,
          price: option.price,
          image: option.image,
          description: option.description,
          quantity: (existing?.quantity || 0) + 1,
        },
      };
    });
  }, []);

  /** Decrement a cart entry's quantity, removing it once it reaches zero. */
  const decrementCartItem = useCallback((mealOptionId) => {
    setCart((prev) => {
      const existing = prev[mealOptionId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        // eslint-disable-next-line no-unused-vars
        const { [mealOptionId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [mealOptionId]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  }, []);

  /** Empty the cart (e.g. the customer clears it before checking out). */
  const clearCart = useCallback(() => setCart({}), []);

  /** Place an order from the current cart and return the created order. */
  const placeOrder = async () => {
    const mealOptionIds = Object.keys(cart).map(Number);
    const quantities = mealOptionIds.map((id) => cart[id].quantity);

    const data = await apiCreateOrder({ mealOptionIds, quantities });
    const order = data.order;

    // Attach resolved meal names/quantities to the order for the confirmation screen
    const items = mealOptionIds.map((id) => {
      const item = cart[id];
      return {
        id,
        name: item?.name || `Meal #${id}`,
        price: item?.price || 0,
        quantity: item?.quantity || 0,
      };
    });

    const enrichedOrder = { ...order, items };
    setLastOrder(enrichedOrder);
    setCart({});
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
    cart,
    fetchDailyOptions,
    addToCart,
    decrementCartItem,
    clearCart,
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
