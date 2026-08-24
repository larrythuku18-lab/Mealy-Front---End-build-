import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);


const DEV_BYPASS_AUTH = true;
const DEV_BYPASS_ROLE = "admin"; 

const DEV_USER = {
  id: "dev-user",
  name: "Dev User",
  email: "dev@example.com",
  role: DEV_BYPASS_ROLE,
  catererId: "dev-caterer",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEV_BYPASS_AUTH ? DEV_USER : null);
  const [token, setToken] = useState(DEV_BYPASS_AUTH ? "dev-bypass-token" : null);
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState(null);

  
  const login = async (credentials) => {
    setStatus("loading");
    setError(null);
    try {
     
      setStatus("idle");
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
      
      setStatus("idle");
    } catch (err) {
      setStatus("failed");
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setStatus("idle");
    setError(null);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
