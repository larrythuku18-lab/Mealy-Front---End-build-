import Navbar from "../components/Navbar/Navbar";
import DailyMealOptionCard from "../components/DailyMealOptionCard/DailyMealOptionCard";
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
      <Navbar />
      <main className="menu-main">
        <div className="menu-header">
          <span className="eyebrow">Today's Selection</span>
          <h1>{dateStr}</h1>
        </div>
        <DailyMealOptionCard />
        <FullMenu />
      </main>
    </div>
  );
}

export default Menu;
