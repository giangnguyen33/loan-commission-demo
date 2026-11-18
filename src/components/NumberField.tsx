interface NumberFieldProps {
  id: string;
  name: string;
  label: string;
  inputMode: 'decimal' | 'numeric';
  min: string;
  step: string;
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
}

export const NumberField = ({
  id,
  name,
  label,
  inputMode,
  min,
  step,
  value,
  error,
  onValueChange,
}: NumberFieldProps) => {
  const errorId = `${id}-error`;

  return (
    <div className="loan-form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="number"
        inputMode={inputMode}
        min={min}
        step={step}
        required
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {error && (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
