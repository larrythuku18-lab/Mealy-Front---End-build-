import { createContext, useContext, useState, useCallback } from "react";
import {
  apiListMealOptions,
  apiCreateMealOption,
  apiUpdateMealOption,
  apiDeleteMealOption,
} from "../api";

const MealOptionsContext = createContext(null);

export function MealOptionsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const fetchMealOptions = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiListMealOptions();
      setItems(data.mealOptions || []);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  }, []);

  const createMealOption = async (mealOption) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiCreateMealOption(mealOption);
      const created = data.mealOption;
      setItems((prev) => [...prev, created]);
      setStatus("succeeded");
      return created;
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const updateMealOption = async (id, changes) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiUpdateMealOption(id, changes);
      const updated = data.mealOption;
      setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setStatus("succeeded");
      return updated;
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const deleteMealOption = async (id) => {
    setStatus("loading");
    setError(null);
    try {
      await apiDeleteMealOption(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const value = {
    items,
    status,
    error,
    fetchMealOptions,
    createMealOption,
    updateMealOption,
    deleteMealOption,
  };

  return (
    <MealOptionsContext.Provider value={value}>
      {children}
    </MealOptionsContext.Provider>
  );
}

export function useMealOptions() {
  const ctx = useContext(MealOptionsContext);
  if (!ctx)
    throw new Error("useMealOptions must be used within a MealOptionsProvider");
  return ctx;
}
