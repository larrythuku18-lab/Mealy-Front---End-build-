import { createContext, useContext, useState, useEffect } from "react";
import { apiGetTodaysMenu, apiListMealOptions, apiCreateOrder } from "../api";

const DailyOptionsContext = createContext(null);

export function DailyOptionsProvider({ children }) {
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  /** Fetch today's published menu and resolve full meal option details. */
  const fetchDailyOptions = async () => {
    setStatus("loading");
    setError(null);
    try {
      // Get today's menu to find which meal option IDs are published
      const menuData = await apiGetTodaysMenu();
      const ids = menuData.mealOptionIds || [];

      if (ids.length === 0) {
        setOptions([]);
        setStatus("succeeded");
        return;
      }

      // Fetch all meal options and filter to the published ones
      const allData = await apiListMealOptions();
      const allOptions = allData.mealOptions || [];
      const published = allOptions.filter((mo) => ids.includes(mo.id));
      setOptions(published);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  };

  /** Place an order for the given selections. */
  const placeOrder = async (selections) => {
    // selections is { [mealOptionId]: quantity }
    const mealOptionIds = Object.keys(selections).map(Number);
    const quantities = mealOptionIds.map((id) => selections[id]);

    try {
      const data = await apiCreateOrder({ mealOptionIds, quantities });
      return data.order;
    } catch (err) {
      throw err;
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchDailyOptions();
  }, []);

  const value = {
    options,
    status,
    error,
    fetchDailyOptions,
    placeOrder,
  };

  return (
    <DailyOptionsContext.Provider value={value}>
      {children}
    </DailyOptionsContext.Provider>
  );
}

export function useDailyOptions() {
  const ctx = useContext(DailyOptionsContext);
  if (!ctx)
    throw new Error(
      "useDailyOptions must be used within DailyOptionsProvider"
    );
  return ctx;
}
