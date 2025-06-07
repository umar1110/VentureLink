import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputStyles = `
      block w-full px-4 py-2 mt-1 
      text-gray-900 bg-white border 
      rounded-md focus:outline-none 
      focus:ring-2 focus:ring-primary-500 
      ${error ? 'border-error-500' : 'border-gray-300'}
    `;

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="ml-1 text-error-600">*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={`${inputStyles} ${className}`}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';