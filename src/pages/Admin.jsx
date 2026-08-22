import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import MealOptionsManagement from "../components/MealOptionssManagement/MealOptionsManagement";
import SetTodaysMenu from "../components/SetTodaysMenu/SetTodaysMenu";
import TodaysOrders from "../components/TodaysOrders/TodaysOrders";
import EditMealModal from "../components/EditMealModal/EditMealModal";
import BtnPrimary from "../components/ui/BtnPrimary";
import "./Admin.css";


function Admin() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-page__content">
        <header className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">Caterer Portal</p>
            <h1>Admin Dashboard</h1>
          </div>
          <BtnPrimary onClick={() => setIsAddModalOpen(true)}>+ Add New Meal</BtnPrimary>
        </header>

        <div className="admin-page__grid">
          <MealOptionsManagement />
          <SetTodaysMenu />
        </div>

        <TodaysOrders />
      </div>

      {isAddModalOpen && <EditMealModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}

export default Admin;
