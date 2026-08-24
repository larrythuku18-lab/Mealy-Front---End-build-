import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: new Date().toISOString().slice(0, 10),
  mealOptionIds: [],
  isPublished: false,
  status: "idle", 
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    fetchStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchSucceeded(state, action) {
      state.status = "succeeded";
      state.mealOptionIds = action.payload.mealOptionIds ?? [];
      state.isPublished = action.payload.isPublished ?? false;
    },
    fetchFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    menuPublished(state, action) {
      state.mealOptionIds = action.payload.mealOptionIds;
      state.isPublished = true;
    },
  },
});

export const { fetchStarted, fetchSucceeded, fetchFailed, menuPublished } = menuSlice.actions;
export default menuSlice.reducer;

export const selectTodaysMenu = (state) => state.menu;

export const fetchTodaysMenu = () => async (dispatch) => {
  dispatch(fetchStarted());
  try {
   
    dispatch(fetchSucceeded({ mealOptionIds: [], isPublished: false })); 
  } catch (err) {
    dispatch(fetchFailed(err.message));
  }
};

export const publishMenu = (mealOptionIds) => async (dispatch) => {

  dispatch(menuPublished({ mealOptionIds })); 
};
