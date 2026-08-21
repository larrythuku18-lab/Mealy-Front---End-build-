import { useEffect, useState } from "react";
import { useMealOptions } from "../../context/MealOptionsContext";
import { useMenu } from "../../context/MenuContext";
import BtnPrimary from "../ui/BtnPrimary";
import "./SetTodaysMenu.css";


function SetTodaysMenu() {
  const { items: mealOptions } = useMealOptions();
  const { mealOptionIds, fetchTodaysMenu, publishMenu } = useMenu();

  const [overrides, setOverrides] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchTodaysMenu();
   
  }, []);

  const selectedIds = overrides ?? mealOptionIds;

  const toggleOption = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setOverrides(next);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishMenu(selectedIds);
      setOverrides(null);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="set-todays-menu">
      <h2>Set Today's Menu</h2>

      <ul className="set-todays-menu__list">
        {mealOptions.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <li key={option.id} className={checked ? "checked" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option.id)}
                />
                {option.name}
              </label>
            </li>
          );
        })}
        {mealOptions.length === 0 && <p>Add meal options first to build today's menu.</p>}
      </ul>

      <BtnPrimary onClick={handlePublish} disabled={isPublishing || selectedIds.length === 0}>
        {isPublishing ? "Publishing..." : "Publish Menu"}
      </BtnPrimary>
    </section>
  );
}

export default SetTodaysMenu;
