import { createContext, useContext, useState, useEffect } from "react";
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetMe,
  setToken,
} from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => {
    // Restore token from localStorage on load
    return localStorage.getItem("mealy_token") || null;
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // On mount or when token changes, restore user from localStorage or fetch from API
  useEffect(() => {
    if (token) {
      setToken(token);
      localStorage.setItem("mealy_token", token);

      // Try to restore user from localStorage first for instant UI
      const stored = localStorage.getItem("mealy_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore parse error
        }
      }

      // Then fetch fresh user data from API
      apiGetMe()
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("mealy_user", JSON.stringify(data.user));
        })
        .catch(() => {
          // Token is invalid — clear everything
          setTokenState(null);
          setToken(null);
          setUser(null);
          localStorage.removeItem("mealy_token");
          localStorage.removeItem("mealy_user");
        });
    } else {
      setToken(null);
      setUser(null);
      localStorage.removeItem("mealy_token");
      localStorage.removeItem("mealy_user");
    }
  }, [token]);

  const login = async (credentials) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiLogin(credentials);
      setTokenState(data.token);
      setUser(data.user);
      localStorage.setItem("mealy_user", JSON.stringify(data.user));
      setStatus("succeeded");
      return data;
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const signup = async (details) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await apiRegister(details);
      setTokenState(data.token);
      setUser(data.user);
      localStorage.setItem("mealy_user", JSON.stringify(data.user));
      setStatus("succeeded");
      return data;
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore logout errors — clear local state regardless
    }
    setTokenState(null);
    setToken(null);
    setUser(null);
    setStatus("idle");
    setError(null);
    localStorage.removeItem("mealy_token");
    localStorage.removeItem("mealy_user");
  };

  /** Update the user object in context (e.g. after profile edit). */
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("mealy_user", JSON.stringify(newUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    status,
    error,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
