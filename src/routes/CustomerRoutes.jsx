import { Navigate, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";


function CustomerRoutes() {
  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </>
  );
}

export default CustomerRoutes;
