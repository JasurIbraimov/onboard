import { type ReactNode } from "react";
import SelectField from "./SelectField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BANKS } from "../../constants";
import countries from "i18n-iso-countries";
import ru from "i18n-iso-countries/langs/ru.json";
import clsx from "clsx";
import RadioField from "./RadioField";
import FileField from "./FileField";
import FormFieldWrapper from "./FormFieldWrapper";
import type { InputType } from "../../types/index.type";

countries.registerLocale(ru);

type NativeInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
>;

interface IProps extends NativeInputProps {
    /** Универсальный коллбэк для всех типов поля */
    onChange?: (state: string | File | null) => void;
    /** Значение для поля (универсальное) */
    value?: string | number | readonly string[] | File | null;
    /** Подпись */
    label?: string;
    labelSuffix?: string;
    /** Дополнительные элементы (иконки, кнопки) */
    actions?: ReactNode;
    /** Поддержка как стандартных, так и кастомных типов */
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"] | InputType;
    error?: boolean;
}

const FormField = ({
    type = "text",
    onChange,
    id,
    value,
    label,
    labelSuffix,
    className,
    actions,
    error,
    ...props
}: IProps) => {
    const countryOptions = Object.entries(countries.getNames("ru")).map(
        ([code, name]) => ({ value: code, label: name })
    );

    const renderField = () => {
        switch (type) {
            case "radio":
                return <RadioField onChange={onChange} />;

            case "tel":
                return (
                    <PhoneInput
                        inputStyle={{ background: "var(--color-base-100)" }}
                        buttonStyle={{ background: "var(--color-base-100)" }}
                        dropdownStyle={{ background: "var(--color-base-100)" }}
                        country="kz"
                        value={(value as string) || ""}
                        onChange={(_, __, ___, formattedValue) =>
                            onChange?.(formattedValue)
                        }
                    />
                );

            case "country":
                return (
                    <SelectField
                        id={id}
                        error={error}
                        className={className}
                        options={countryOptions}
                        value={(value as string) || ""}
                        onChange={onChange}
                        placeholder="Выберите страну"
                    />
                );

            case "bank":
                return (
                    <SelectField
                        id={id}
                        error={error}
                        className={className}
                        options={BANKS}
                        value={(value as string) || ""}
                        onChange={onChange}
                        placeholder="Выберите банк"
                    />
                );

            case "range":
                return (
                    <input
                        type="range"
                        value={value as number | string}
                        className="range"
                        onChange={(e) => onChange?.(e.target.value)}
                        {...props}
                    />
                );

            case "file":
                return (
                    <FileField
                        {...props}
                        id={id}
                        error={error}
                        onChange={onChange}
                        file={(value as File) || null}
                    />
                );

            default:
                return (
                    <input
                        id={id}
                        type={type}
                        value={
                            (value as string | number | readonly string[]) || ""
                        }
                        onChange={(e) => onChange?.(e.target.value)}
                        className={clsx(
                            "input grow outline-none",
                            error && "border-error",
                            className
                        )}
                        {...props}
                    />
                );
        }
    };

    return (
        <FormFieldWrapper
            className="flex w-full items-center grow gap-2 flex-wrap sm:flex-nowrap"
            label={label}
            labelSuffix={labelSuffix}
        >
            {renderField()}
            {actions}
        </FormFieldWrapper>
    );
};

export default FormField;
