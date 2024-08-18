import React from "react";
import "./Input.scss";

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  readOnly = false,
  required = false,
  placeholder = "",
  uppercase = false, // Nueva propiedad
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={(e) => {
        const newValue = uppercase
          ? e.target.value.toUpperCase()
          : e.target.value;
        onChange(newValue); // Pasamos directamente el valor
      }}
      readOnly={readOnly}
      required={required}
      placeholder={placeholder || undefined}
      style={uppercase ? { textTransform: "uppercase" } : {}}
    />
  </div>
);

export default Input;
