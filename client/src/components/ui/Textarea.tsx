import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const textareaStyles = `
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

        <textarea
          ref={ref}
          className={`${textareaStyles} ${className}`}
          rows={props.rows || 4}
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

Textarea.displayName = 'Textarea';