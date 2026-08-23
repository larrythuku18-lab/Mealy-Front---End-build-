function Btn({
  children,
  type = "button",
  title,
  onClick,
  variant = "primary",
  className = "",
}) {
  const base =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "tertiary"
        ? "btn-tertiary"
        : variant === "save"
          ? "btn-save"
          : variant === "cancel"
            ? "btn-cancel"
            : "btn-primary";
  return (
    <button
      type={type}
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`${base} ${className}`}
    >
      {children}
    </button>
  );
}

export default Btn;
