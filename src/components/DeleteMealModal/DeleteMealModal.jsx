import { useState } from "react";
import { useMealOptions } from "../../context/MealOptionsContext";
import BtnPrimary from "../ui/BtnPrimary";
import "./DeleteMealModal.css";


function DeleteMealModal({ mealOption, onClose }) {
  const { deleteMealOption } = useMealOptions();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMealOption(mealOption.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-meal-modal__overlay" onClick={onClose}>
      <div className="delete-meal-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Meal Option</h2>
        <p>
          Are you sure you want to delete <strong>{mealOption.name}</strong>? This
          can't be undone.
        </p>

        <div className="delete-meal-modal__actions">
          <BtnPrimary variant="secondary" onClick={onClose}>
            Cancel
          </BtnPrimary>
          <BtnPrimary variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
}

export default DeleteMealModal;
