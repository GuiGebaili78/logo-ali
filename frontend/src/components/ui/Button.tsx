// frontend/src/components/ui/Button.tsx
"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({ 
  variant = "primary", 
  size = "md", 
  className = "", 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent-color text-white hover:bg-accent-color/90 focus:ring-accent-color",
    secondary: "bg-secondary-color text-light-color hover:bg-secondary-color/90 focus:ring-secondary-color",
    outline: "border-2 border-accent-color text-accent-color hover:bg-accent-color hover:text-white focus:ring-accent-color"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// frontend/src/components/ui/Input.tsx
"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ 
  label, 
  error, 
  className = "", 
  ...props 
}: InputProps) {
  const baseStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all duration-200";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledStyles = props.disabled ? "bg-gray-100 cursor-not-allowed" : "";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${errorStyles} ${disabledStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// frontend/src/components/ui/Loading.tsx
"use client";

import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({ 
  size = "md", 
  text, 
  className = "" 
}: LoadingProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-accent-color border-t-transparent ${sizes[size]}`} />
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
}