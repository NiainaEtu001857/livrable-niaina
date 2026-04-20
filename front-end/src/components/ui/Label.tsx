type LabelProps = {
  children: React.ReactNode;
  required?: boolean;
};

const Label = ({ children, required }: LabelProps) => {
  return (
    <label className="label">
      {children}
      {required && <span className="req"> *</span>}
    </label>
  );
};

export default Label;