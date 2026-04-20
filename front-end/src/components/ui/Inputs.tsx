import Label from "./Label";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  required?: boolean;
};

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  error,
  required, 
  ...rest
}: Props) {
  return (
  <div className="field">
    {label && (
      <Label required={required}>
        {label}
      </Label>
    )}

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input ${error ? "inputErr" : ""}`}
      {...rest}
    />

    {error && <p className="errMsg">{error}</p>}
  </div>
);
}