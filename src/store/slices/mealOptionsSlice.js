import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  items: [],
  status: "idle", 
  error: null,
};

const mealOptionsSlice = createSlice({
  name: "mealOptions",
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
    mealOptionAdded(state, action) {
      state.items.push(action.payload);
    },
    mealOptionUpdated(state, action) {
      const index = state.items.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    mealOptionRemoved(state, action) {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
  },
});

export const {
  fetchStarted,
  fetchSucceeded,
  fetchFailed,
  mealOptionAdded,
  mealOptionUpdated,
  mealOptionRemoved,
} = mealOptionsSlice.actions;

export default mealOptionsSlice.reducer;


export const selectMealOptions = (state) => state.mealOptions.items;
export const selectMealOptionsStatus = (state) => state.mealOptions.status;


export const fetchMealOptions = () => async (dispatch) => {
  dispatch(fetchStarted());
  try {
   
    dispatch(fetchSucceeded([])); 
  } catch (err) {
    dispatch(fetchFailed(err.message));
  }
};

export const createMealOption = (mealOption) => async (dispatch) => {
 
  dispatch(mealOptionAdded({ id: Date.now(), ...mealOption }));
};

export const updateMealOption = (id, changes) => async (dispatch) => {

  dispatch(mealOptionUpdated({ id, ...changes })); 
};

export const deleteMealOption = (id) => async (dispatch) => {

  dispatch(mealOptionRemoved(id));
};
