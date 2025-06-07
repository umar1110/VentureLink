import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', ...props }, ref) => {
    const selectStyles = `
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

        <select
          ref={ref}
          className={`${selectStyles} ${className}`}
          {...props}
        >
          <option value="" disabled>
            Select an option
          </option>
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = 'Select';