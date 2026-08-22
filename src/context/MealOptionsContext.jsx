import { createContext, useContext, useState } from "react";

const MealOptionsContext = createContext(null);


const DEMO_MEAL_OPTIONS = [
  { id: 1, name: "Beef with Rice", description: "Tender beef slices with jasmine brown rice.", price: 750, catererId: "dev-caterer" },
  { id: 2, name: "Chicken with Fries", description: "Grilled breast with baked sweet potato fries.", price: 1050, catererId: "dev-caterer" },
  { id: 3, name: "Veggie Pasta", description: "Whole wheat penne with fresh basils.", price: 1200, catererId: "dev-caterer" },
  { id: 4, name: "Salmon Teriyaki", description: "Salmon fillet with glazed teriyaki.", price: 1400, catererId: "dev-caterer" },
  { id: 5, name: "Avocado Salad", description: "Fresh greens with sliced avocados & sesame dress.", price: 900, catererId: "dev-caterer" },
];


export function MealOptionsProvider({ children }) {
  const [items, setItems] = useState(DEMO_MEAL_OPTIONS);
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "failed"
  const [error, setError] = useState(null);

  const fetchMealOptions = async () => {
    setStatus("loading");
    setError(null);
    try {
    
      setStatus("idle");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
    }
  };

  const createMealOption = async (mealOption) => {
   
    const created = { id: Date.now(), ...mealOption }; // placeholder
    setItems((prev) => [...prev, created]);
    return created;
  };

  const updateMealOption = async (id, changes) => {
  
    const updated = { id, ...changes }; // placeholder
    setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
    return updated;
  };

  const deleteMealOption = async (id) => {
   
    setItems((prev) => prev.filter((m) => m.id !== id));
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

  return <MealOptionsContext.Provider value={value}>{children}</MealOptionsContext.Provider>;
}


export function useMealOptions() {
  const ctx = useContext(MealOptionsContext);
  if (!ctx) throw new Error("useMealOptions must be used within a MealOptionsProvider");
  return ctx;
}
