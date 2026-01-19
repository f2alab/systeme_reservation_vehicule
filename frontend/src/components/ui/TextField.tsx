// components/TextField.tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  required?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  showPasswordToggle = false,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={effectiveType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
        />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            disabled={disabled}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? (
              <EyeOff />
            ) : (
              <Eye />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TextField;
