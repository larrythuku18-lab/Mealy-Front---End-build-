import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DailyOptionsProvider } from "./contexts/DailyOptionsContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <DailyOptionsProvider>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </DailyOptionsProvider>
    </BrowserRouter>
  );
}

export default App;
