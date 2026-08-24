import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Menu from "../pages/Menu";
function CustomerRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Menu />} />
      </Route>
    </>
  );
}

export default CustomerRoutes;
