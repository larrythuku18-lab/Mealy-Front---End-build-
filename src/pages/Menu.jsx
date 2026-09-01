import Navbar from "../components/Navbar/Navbar";
import DailyMealOptions from "../components/DailyMealOptions/DailyMealOptions";
import { currentUser } from "../data/mockData";
import "./Menu.css";
import FullMenu from "../components/FullMenu/FullMenu";

function Menu() {
  return (
    <div className="page">
      <Navbar user={currentUser} />
      <main className="menu-main">
        <DailyMealOptions />
        <FullMenu />
      </main>
    </div>
  );
}

export default Menu;
