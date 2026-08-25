import { createContext, useContext, useState } from "react";

const MenuContext = createContext(null);


const DEMO_MEAL_OPTION_IDS = [1, 2, 3];


export function MenuProvider({ children }) {
  const [mealOptionIds, setMealOptionIds] = useState(DEMO_MEAL_OPTION_IDS);
  const [isPublished, setIsPublished] = useState(true);
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState(null);

const fetchTodaysMenu = async () => {
     setStatus("loading");
     setError(null);
     try {
      
       setStatus("idle");
     } catch (err) {
       setStatus("failed");
       setError(err.message);
     }
   };

   const publishMenu = async (ids) => {
   
     setMealOptionIds(ids);
     setIsPublished(true);
   };

   const value = { mealOptionIds, isPublished, status, error, fetchTodaysMenu, publishMenu };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}



export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within a MenuProvider");
  return ctx;
}
