import { forwardRef } from 'react';
import { Input } from '@/components/ui/Input';

/**
 * Props for the AuthInput component.
 * Extends the base Input props to lock monochrome styling for auth forms.
 * @property label - Visible label text for the input.
 * @property id - Unique ID, used to link label and error via aria-describedby.
 * @property error - Optional error message string (displayed in red).
 * @property helperText - Optional hint text shown below the input when no error is present.
 */
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

/**
 * Monochrome-locked input for auth forms.
 * Thin wrapper around the base Input component that applies
 * consistent styling without allowing per-instance overrides.
 */
export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, id, error, helperText, ...rest }, ref) => {
    return (
      <Input
        ref={ref}
        label={label}
        id={id}
        error={error}
        helperText={helperText}
        {...rest}
      />
    );
  },
);

AuthInput.displayName = 'AuthInput';
