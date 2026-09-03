import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu from "./pages/Menu";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

/**
 * Home gate: admins land on /admin when they open the site root,
 * unless they arrived via the navbar's storefront (Menu) link.
 */
function HomeGate() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    !location.state?.browseStorefront
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <Menu />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
