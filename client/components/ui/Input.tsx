import { forwardRef } from "react";

/**
 * Props for the Input component.
 * @property label - Visible label text for the input.
 * @property id - Unique ID, used to link label and error via aria-describedby.
 * @property error - Optional error message string.
 * @property className - Additional CSS classes for the wrapper.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

/**
 * Accessible text input with label and optional error message.
 * Monochrome styling with 1px borders, no shadows.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, className = "", type = "text", ...rest }, ref) => {
    const errorId = `${id}-error`;

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
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          className={`w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-black placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
            error ? "border-gray-700" : "border-gray-200"
          }`}
          {...rest}
        />
        {error && (
          <p id={errorId} className="text-xs text-gray-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
