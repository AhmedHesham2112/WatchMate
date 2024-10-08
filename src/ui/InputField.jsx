import React from "react";

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div className="flex justify-between">
      <label>
        {label} <sup>*</sup>
      </label>
      <input
        className="input ml-3 border-2 text-black"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
      />
    </div>
  );
}

export default InputField;
