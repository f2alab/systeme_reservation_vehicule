// components/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  loading = false,
  loadingText,
  disabled = false,
  className = '',
  onClick,
}) => {
  const baseClasses =
    'w-full bg-gradient-to-r from-blue-500 to-blue-600 ' +
    'hover:from-blue-600 hover:to-blue-700 ' +
    'disabled:from-gray-400 disabled:to-gray-400 ' +
    'text-white font-semibold py-3 rounded-lg ' +
    'transition duration-200 transform hover:scale-105 ' +
    'disabled:scale-100 disabled:opacity-50 shadow-lg';

  const combinedClassName = `${baseClasses} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={combinedClassName}
      onClick={onClick}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText || 'Chargement...'}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;