// Caminho: frontend/src/components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Adicione a propriedade 'loading' aqui
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`
        px-6 py-3 rounded-md font-semibold transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed 
        bg-primary text-white hover:bg-primary-dark
        ${className}
      `}
      disabled={loading || props.disabled}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
};

export default Button;
