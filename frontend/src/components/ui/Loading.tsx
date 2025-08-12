import React from "react";

interface Props {
  size?: number;
  text?: string;
}

export default function Loading({ size = 36, text = "Carregando..." }: Props) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeOpacity="0.15"
        />
        <path
          d="M45 25a20 20 0 00-20-20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-sm">{text}</span>
    </div>
  );
}
