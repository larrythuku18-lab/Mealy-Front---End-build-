import { createContext, useContext, useState } from "react";
import { dailyOptions as defaultOptions } from "../data/mockData";

const DailyOptionsContext = createContext(null);

export function DailyOptionsProvider({ children }) {
  const [options, setOptions] = useState(defaultOptions);

  const addOption = (option) => {
    setOptions((prev) => [
      ...prev,
      { ...option, id: `d${Date.now()}` },
    ]);
  };

  const updateOption = (id, updates) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, ...updates } : opt))
    );
  };

  const removeOption = (id) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  return (
    <DailyOptionsContext.Provider
      value={{ options, addOption, updateOption, removeOption }}
    >
      {children}
    </DailyOptionsContext.Provider>
  );
}

export function useDailyOptions() {
  const ctx = useContext(DailyOptionsContext);
  if (!ctx) throw new Error("useDailyOptions must be used within DailyOptionsProvider");
  return ctx;
}
