import clsx from "clsx";
import Select, { type SingleValue } from "react-select";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps {
    id?: string;
    className?: string;
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    error?: boolean
}

const SelectField = ({
    id,
    className,
    options,
    value,
    onChange,
    placeholder,
}: SelectFieldProps) => {
    return (
        <Select<Option, false>
            inputId={id}
            className={clsx("w-full", className)}
            options={options}
            
            value={options.find((opt) => opt.value === value) ?? null}
            onChange={(opt: SingleValue<Option>) => {
                if (opt) onChange?.(opt.value);
                else onChange?.("");
            }}
            placeholder={placeholder}
            isSearchable
            isClearable
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: "var(--color-base-200)",
                    primary25: "var(--color-base-300)",
                    neutral0: "var(--color-base-100)",
                    neutral80: "var(--color-base-content)",
                },
            })}
        />
    );
};

export default SelectField;
