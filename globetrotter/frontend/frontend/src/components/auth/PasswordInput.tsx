import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  autoComplete = 'current-password',
  value,
  onChange,
  placeholder = '••••••••',
  id,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `password-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-field-group">
      <label htmlFor={inputId} className="auth-field-label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <div className={`auth-input-wrapper ${error ? 'has-error' : ''}`}>
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className="auth-input-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={toggleShowPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span id={`${inputId}-error`} className="auth-field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
