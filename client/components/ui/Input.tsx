import { forwardRef } from "react";

/**
 * Props for the Input component.
 * @property label - Visible label text for the input.
 * @property id - Unique ID, used to link label and error via aria-describedby.
 * @property error - Optional error message string (displayed in red).
 * @property helperText - Optional hint text shown below the input when no error is present.
 * @property className - Additional CSS classes for the wrapper.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

/**
 * Accessible text input with label, optional error message, and helper text.
 * Monochrome styling with 1px borders, no shadows.
 * Error text uses red; helper text uses subtle gray.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, helperText, className = "", type = "text", ...rest }, ref) => {
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const describedBy = error
      ? errorId
      : helperText
        ? helperId
        : undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-black placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
            error ? "border-red-400" : "border-gray-200"
          }`}
          {...rest}
        />
        {error && (
          <p id={errorId} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
