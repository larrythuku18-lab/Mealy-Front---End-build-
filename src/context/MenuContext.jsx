import { createContext, useContext, useState, useCallback } from "react";
import { apiGetTodaysMenu, apiPublishMenu } from "../api";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [mealOptionIds, setMealOptionIds] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const fetchTodaysMenu = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiGetTodaysMenu();
      setMealOptionIds(data.mealOptionIds || []);
      setIsPublished(data.isPublished || false);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  }, []);

  const publishMenu = async (ids) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiPublishMenu(ids);
      setMealOptionIds(data.mealOptionIds || ids);
      setIsPublished(true);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const value = {
    mealOptionIds,
    isPublished,
    status,
    error,
    fetchTodaysMenu,
    publishMenu,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within a MenuProvider");
  return ctx;
}
