import { createSlice } from "@reduxjs/toolkit";
import {
  apiListMealOptions,
  apiCreateMealOption,
  apiUpdateMealOption,
  apiDeleteMealOption,
} from "../../api";

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

// Thunks
export const fetchMealOptions = () => async (dispatch) => {
  dispatch(fetchStarted());
  try {
    const data = await apiListMealOptions();
    dispatch(fetchSucceeded(data.mealOptions || []));
  } catch (err) {
    dispatch(fetchFailed(err.message));
  }
};

export const createMealOption = (mealOption) => async (dispatch) => {
  try {
    const data = await apiCreateMealOption(mealOption);
    dispatch(mealOptionAdded(data.mealOption));
    return data.mealOption;
  } catch (err) {
    throw err;
  }
};

export const updateMealOption = (id, changes) => async (dispatch) => {
  try {
    const data = await apiUpdateMealOption(id, changes);
    dispatch(mealOptionUpdated(data.mealOption));
    return data.mealOption;
  } catch (err) {
    throw err;
  }
};

export const deleteMealOption = (id) => async (dispatch) => {
  try {
    await apiDeleteMealOption(id);
    dispatch(mealOptionRemoved(id));
  } catch (err) {
    throw err;
  }
};
