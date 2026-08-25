import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  status: "idle", 
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchSucceeded(state, action) {
      state.status = "succeeded";
      state.items = action.payload;
    },
    fetchFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { fetchStarted, fetchSucceeded, fetchFailed } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectTodaysOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectTotalRevenue = (state) =>
  state.orders.items.reduce((sum, order) => sum + order.price, 0);

export const fetchTodaysOrders = () => async (dispatch) => {
  dispatch(fetchStarted());
  try {
   
    dispatch(fetchSucceeded([])); 
  } catch (err) {
    dispatch(fetchFailed(err.message));
  }
};
