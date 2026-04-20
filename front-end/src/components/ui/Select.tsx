import Label from "./Label";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  required?: boolean;
};

export default function Select({
  label,
  value,
  onChange,
  options,
  error,
  required,
}: SelectProps) {
  return (
    <div className="field">
      {label && <Label required={required}>{label}</Label>}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`select ${error ? "selectErr" : ""}`}
      >
        <option value="">-- Sélectionner --</option>

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <p className="errMsg">{error}</p>}
    </div>
  );
}