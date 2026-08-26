import { createSlice } from "@reduxjs/toolkit";
import { apiLogin, apiRegister } from "../../api";

const initialState = {
  user: null,
  token: localStorage.getItem("mealy_token") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    credentialsSet(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
    },
    authRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
    loggedOut(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { authRequestStarted, credentialsSet, authRequestFailed, loggedOut } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;

// Thunks
export const login = (credentials) => async (dispatch) => {
  dispatch(authRequestStarted());
  try {
    const data = await apiLogin(credentials);
    localStorage.setItem("mealy_token", data.token);
    dispatch(credentialsSet(data));
    return data;
  } catch (err) {
    dispatch(authRequestFailed(err.message));
    throw err;
  }
};

export const signup = (details) => async (dispatch) => {
  dispatch(authRequestStarted());
  try {
    const data = await apiRegister(details);
    localStorage.setItem("mealy_token", data.token);
    dispatch(credentialsSet(data));
    return data;
  } catch (err) {
    dispatch(authRequestFailed(err.message));
    throw err;
  }
};

export const logoutThunk = () => async (dispatch) => {
  localStorage.removeItem("mealy_token");
  dispatch(loggedOut());
};
