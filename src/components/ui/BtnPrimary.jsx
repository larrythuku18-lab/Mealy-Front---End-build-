import "./BtnPrimary.css";

/**
 * Shared primary button. variant="danger" for destructive actions
 * (e.g. Delete) - everything else defaults to the brand style.
 */
function BtnPrimary({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`btn-primary btn-primary--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default BtnPrimary;
