import { Route } from "react-router-dom";
import Admin from "../pages/Admin";


function AdminRoutes() {
  return <Route path="/admin" element={<Admin />} />;
}

export default AdminRoutes;
