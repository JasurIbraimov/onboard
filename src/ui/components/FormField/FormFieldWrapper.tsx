import { type ReactNode } from "react";

interface WrapperProps {
  label?: string;
  labelSuffix?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}

const FormFieldWrapper = ({ label, labelSuffix = ":", id, className, children }: WrapperProps) => (
  <div className={"flex grow gap-1 w-full flex-col items-start"}>
    {label && <label htmlFor={id}>{label}{labelSuffix}</label>}
    <div className={className}>
      {children}
    </div>
  </div>
);

export default FormFieldWrapper;
