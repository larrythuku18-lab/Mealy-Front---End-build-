import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import mealOptionsReducer from "./slices/mealOptionsSlice";
import menuReducer from "./slices/menuSlice";
import ordersReducer from "./slices/ordersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mealOptions: mealOptionsReducer,
    menu: menuReducer,
    orders: ordersReducer,
  },
});
