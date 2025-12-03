import { useState } from "react";
import Button from "../Button/Button";
import FormField from "../FormField/FormField";
import clsx from "clsx";

export interface Variant<T> {
    value: T;
    label: string;
}

interface CommonProps<T> {
    title?: string;
    className?: string;
    options: Readonly<Array<T | Variant<T>>>;
    showOther?: boolean;
    error?: boolean
}

// single
interface SingleProps<T> extends CommonProps<T> {
    mode?: "single";
    value: T | string | null;
    onChange: (value: T | string | null) => void;
}

// multiple
interface MultipleProps<T> extends CommonProps<T> {
    mode: "multiple";
    value: (T | string)[];
    onChange: (value: (T | string)[]) => void;
}

type Props<T> = SingleProps<T> | MultipleProps<T>;

function VariantPicker<T extends string | number>({
    title,
    options,
    value,
    onChange,
    showOther = false,
    error, 
    className,
    mode = "single",
}: Props<T>) {
    const [isOtherActive, setIsOtherActive] = useState(false);
    const [customValue, setCustomValue] = useState("");

    const normalizedOptions: Variant<T>[] = options.map((opt) =>
        typeof opt === "object"
            ? (opt as Variant<T>)
            : { value: opt, label: String(opt) }
    );

    const handleClick = (optionValue: T | "other") => {
        if (optionValue === "other") {
            setIsOtherActive(true);
            if (mode === "single") {
                (onChange as (value: string) => void)(customValue || "");
            }
            return;
        }

        setIsOtherActive(false);

        if (mode === "single") {
            const currentValue = value as T | string | null;
            const newValue = currentValue === optionValue ? null : optionValue; // toggle
            (onChange as (value: T | string | null) => void)(newValue);
        } else {
            const current = value as (T | string)[];
            const newValue = current.includes(optionValue)
                ? current.filter((v) => v !== optionValue)
                : [...current, optionValue];
            (onChange as (value: (T | string)[]) => void)(newValue);
        }
    };

    const handleCustomChange = (val: string) => {
        setCustomValue(val);
        if (mode === "single") {
            (onChange as (value: string) => void)(val);
        }
    };

    const isSelected = (optionValue: T | "other"): boolean => {
        if (optionValue === "other") return isOtherActive;
        if (mode === "single") return value === optionValue;
        return Array.isArray(value) && value.includes(optionValue);
    };

    return (
        <div>
            {title && (
                <label className="label">
                    <span className="label-text font-medium">{title}</span>
                </label>
            )}

            <div className={clsx("flex gap-2 mt-1 p-1 border", error ? "border-error" : "border-transparent", className)}>
                {normalizedOptions.map(({ value: optionValue, label }) => (
                    <Button
                        key={String(optionValue)}
                        type="button"
                        onClick={() => handleClick(optionValue)}
                        variant={isSelected(optionValue) ? "accent" : "primary"}
                    >
                        {label}
                    </Button>
                ))}
                {showOther && (
                    <Button
                        type="button"
                        onClick={() => handleClick("other")}
                        variant={isSelected("other") ? "accent" : "primary"}
                    >
                        Другое
                    </Button>
                )}
            </div>

            {isOtherActive && (
                <div className="mt-2">
                    <FormField
                        placeholder="Введите другое значение"
                        value={customValue}
                        onChange={(val) => handleCustomChange(val as string)}
                    />
                </div>
            )}
        </div>
    );
}

export default VariantPicker;
