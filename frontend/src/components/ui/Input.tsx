import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export default function Input({
  label,
  error,
  className = "",
  ...rest
}: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        {...rest}
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-color"
        style={{ borderColor: "var(--secondary-color)" }}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
