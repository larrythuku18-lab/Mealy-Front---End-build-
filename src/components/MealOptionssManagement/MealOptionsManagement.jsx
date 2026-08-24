import { useEffect, useState } from "react";
import { useMealOptions } from "../../context/MealOptionsContext";
import EditMealModal from "../EditMealModal/EditMealModal";
import DeleteMealModal from "../DeleteMealModal/DeleteMealModal";
import "./MealOptionsManagement.css";


function MealOptionsManagement() {
  const { items: mealOptions, status, fetchMealOptions } = useMealOptions();

  const [editingMealOption, setEditingMealOption] = useState(null);
  const [deletingMealOption, setDeletingMealOption] = useState(null);

  useEffect(() => {
    fetchMealOptions();
   
  }, []);

  return (
    <section className="meal-options-management">
      <header className="meal-options-management__header">
        <h2>Meal Options Management</h2>
        <span className="meal-options-management__count">{mealOptions.length} Total Options</span>
      </header>

      {status === "loading" && <p>Loading meal options...</p>}
      {status === "failed" && <p className="meal-options-management__error">Could not load meal options.</p>}
      {status !== "loading" && mealOptions.length === 0 && (
        <p>No meal options yet. Add one from the button above.</p>
      )}

      {mealOptions.length > 0 && (
        <table className="meal-options-management__table">
          <thead>
            <tr>
              <th>Meal Name</th>
              <th>Description</th>
              <th className="meal-options-management__actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mealOptions.map((option) => (
              <tr key={option.id}>
                <td className="meal-options-management__name">{option.name}</td>
                <td className="meal-options-management__description">{option.description}</td>
                <td className="meal-options-management__actions-col">
                  <button className="link-action" onClick={() => setEditingMealOption(option)}>
                    Edit
                  </button>
                  <button className="link-action link-action--danger" onClick={() => setDeletingMealOption(option)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingMealOption && (
        <EditMealModal mealOption={editingMealOption} onClose={() => setEditingMealOption(null)} />
      )}

      {deletingMealOption && (
        <DeleteMealModal mealOption={deletingMealOption} onClose={() => setDeletingMealOption(null)} />
      )}
    </section>
  );
}

export default MealOptionsManagement;
