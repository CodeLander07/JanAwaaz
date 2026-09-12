'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';

/**
 * Props for the PasswordInput component.
 * Same as InputProps minus `type`, which is controlled internally.
 * @property label - Visible label text for the input.
 * @property id - Unique ID, used to link label and error via aria-describedby.
 * @property error - Optional error message string (displayed in red).
 * @property helperText - Optional hint text shown below the input when no error is present.
 */
interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

/**
 * Password input with a visibility toggle button.
 * Switches between `type="password"` and `type="text"` on toggle.
 * The toggle button has an accessible aria-label that updates with state.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, id, error, helperText, className = '', ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={`relative ${className}`}>
        <Input
          ref={ref}
          label={label}
          id={id}
          type={visible ? 'text' : 'password'}
          error={error}
          helperText={helperText}
          className="[&_input]:pr-11"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-[34px] p-1 text-gray-400 hover:text-black transition-colors cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {visible ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
