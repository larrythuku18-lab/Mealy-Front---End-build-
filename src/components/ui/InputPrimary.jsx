function InputPrimary({ label, type = "text", id, name, placeholder, value, onChange }) {
  return (
    <div className="input-primary">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name || id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputPrimary;
