import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const input = (
    <input
      type={inputType}
      title={title}
      aria-label={labelExists ? undefined : title}
      id={id}
      name={name || id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );

  return (
    <div className={`input-primary ${labelExists ? "" : "no-label"}`}>
      <label htmlFor={id}>{label}</label>
      {isPassword ? (
        <div className="input-password-wrapper">
          {input}
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword((shown) => !shown)}
            title={showPassword ? "Hide password" : "Show password"}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      ) : (
        input
      )}
    </div>
  );
}

export default Input;
