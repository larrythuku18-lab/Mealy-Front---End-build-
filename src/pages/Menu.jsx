import Navbar from "../components/Navbar/Navbar";
import DailyMealOptions from "../components/DailyMealOptions/DailyMealOptions";
import { currentUser } from "../data/mockData";
import "./Menu.css";
import FullMenu from "../components/FullMenu/FullMenu";

function Menu() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page">
      <Navbar user={currentUser} />
      <main className="menu-main">
        <div className="menu-header">
          <span className="eyebrow">Today's Selection</span>
          <h1>{dateStr}</h1>
        </div>

        <DailyMealOptions />
        <FullMenu />
      </main>
    </div>
  );
}

export default Menu;
