function Input({
  label,
  labelExists = true,
  type = "text",
  title,
  id,
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className={`input-primary ${labelExists ? "" : "no-label"}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        title={title}
        aria-label={labelExists ? undefined : title}
        id={id}
        name={name || id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;
