import { BrowserRouter, Routes } from "react-router-dom";
import CustomerRoutes from "./routes/CustomerRoutes";
import AdminRoutes from "./routes/AdminRoutes";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {CustomerRoutes()}
        {AdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
