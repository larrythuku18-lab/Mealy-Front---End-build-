import "./InputPrimary.css";

/**
 * Shared labeled input. Pass `error` to show validation messaging -
 * used by EditMealModal's form fields.
 */
function InputPrimary({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  ...rest
}) {
  return (
    <label className="input-primary">
      {label && <span className="input-primary__label">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-primary__field ${error ? "input-primary__field--error" : ""}`}
        {...rest}
      />
      {error && <span className="input-primary__error">{error}</span>}
    </label>
  );
}

export default InputPrimary;
