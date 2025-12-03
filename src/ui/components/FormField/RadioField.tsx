import React from "react";
type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
   "onChange"
>;

interface IProps extends NativeInputProps {
    label?: string;
    labelSuffix?: string;
    onChange?: (state: string) => void;
}
const RadioField = ({
    id,
    onChange,
    label,
    labelSuffix = ":",
    ...props
}: IProps) => {
    return (
        <div className="flex gap-1">
            <input
                id={id}
                type="radio"
                className="radio"
                onChange={(e) => onChange?.(e.target.value)}
                {...props}
            />
            {label && (
                <label htmlFor={id} className="ml-1 cursor-pointer">
                    {label} {labelSuffix}
                </label>
            )}
        </div>
    );
};

export default RadioField;
