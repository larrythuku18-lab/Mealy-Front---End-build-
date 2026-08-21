function BtnPrimary({ children, type = "button", onClick, variant = "primary", className = "" }) {
  const base = variant === "cancel" ? "btn-cancel" : variant === "save" ? "btn-save" : "btn-primary";
  return (
    <button type={type} onClick={onClick} className={`${base} ${className}`}>
      {children}
    </button>
  );
}

export default BtnPrimary;
