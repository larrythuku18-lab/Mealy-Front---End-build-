import { useState } from "react";
import { useMealOptions } from "../../context/MealOptionsContext";
import InputPrimary from "../ui/InputPrimary";
import BtnPrimary from "../ui/BtnPrimary";
import "./EditMealModal.css";


function EditMealModal({ mealOption, onClose }) {
  const { createMealOption, updateMealOption } = useMealOptions();
  const isEditing = Boolean(mealOption);

  const [form, setForm] = useState(() => ({
    name: mealOption?.name ?? "",
    description: mealOption?.description ?? "",
    price: mealOption?.price ?? "",
  }));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a valid price";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (isEditing) {
        await updateMealOption(mealOption.id, payload);
      } else {
        await createMealOption(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-meal-modal__overlay" onClick={onClose}>
      <div className="edit-meal-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Edit Meal Option" : "Add Meal Option"}</h2>

        <form onSubmit={handleSubmit} className="edit-meal-modal__form">
          <InputPrimary
            label="Name"
            placeholder="e.g. Beef with rice"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
          <InputPrimary
            label="Description"
            placeholder="Optional details"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <InputPrimary
            label="Price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            error={errors.price}
            required
          />

          <div className="edit-meal-modal__actions">
            <BtnPrimary type="button" variant="secondary" onClick={onClose}>
              Cancel
            </BtnPrimary>
            <BtnPrimary type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Meal Option"}
            </BtnPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMealModal;
