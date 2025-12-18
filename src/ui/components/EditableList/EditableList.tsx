import React, { useState } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";
import FormField from "../FormField/FormField";
import VariantPicker from "../VariantPicker/VariantPicker";
import clsx from "clsx";
import type { InputType } from "../../types/index.type";
import Button from "../Button/Button";

type EditableListProps<T extends object | string> = {
    title?: string;
    unique?: boolean;
    items: T[];
    onChange: (items: T[]) => void;
    renderItem: (item: T) => React.ReactNode;
    schema?: Record<
        keyof T,
        | { type: "text"; placeholder?: string; inputType?: InputType }
        | { type: "variant"; options: { value: string; label: string }[] }
    >;
    error?: boolean;
    suffix?: string
};

function EditableList<T extends object | string>({
    title,
    items,
    onChange,
    renderItem,
    unique,
    error,
    schema,
    suffix = ":"
}: EditableListProps<T>) {
    // Если string — отдельный state
    const [draftString, setDraftString] = useState<string>("");

    // Если object — draft по schema
    const [draftObject, setDraftObject] = useState<Partial<T>>(() => {
        if (!schema) return {};
        const initial: Partial<T> = {};
        for (const key in schema) {
            const field = schema[key];
            if (field.type === "variant") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                initial[key] = field.options[0].value as any;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                initial[key] = "" as any;
            }
        }
        return initial;
    });

    const [errorIndex, setErrorIndex] = useState<number | null>(null);

    const handleAdd = () => {
        if (typeof items[0] === "string" || schema === undefined) {
            if (!draftString.trim()) return;
            if (unique) {
                const dupIndex = (items as string[]).findIndex(
                    (item) => item === draftString
                );
                if (dupIndex !== -1) {
                    triggerError(dupIndex);
                    return;
                }
            }

            onChange([...items, draftString as T]);
            setDraftString("");
        } else {
            const hasValue = Object.values(draftObject).every(
                (val) => typeof val === "string" && val.trim() !== ""
            );

            if (!hasValue) return;
            if (unique) {
                const dupIndex = items.findIndex(
                    (item) =>
                        JSON.stringify(item) === JSON.stringify(draftObject)
                );
                if (dupIndex !== -1) {
                    triggerError(dupIndex);
                    return;
                }
            }
            onChange([...items, draftObject as T]);
            resetDraftObject();
        }
    };

    const triggerError = (index: number) => {
        setErrorIndex(index);
        setTimeout(() => setErrorIndex(null), 800); // сбросим через 0.8 сек
    };

    const resetDraftObject = () => {
        if (!schema) return;
        const initial: Partial<T> = {};
        for (const key in schema) {
            const field = schema[key];
            if (field.type === "variant") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                initial[key] = field.options[0].value as any;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                initial[key] = "" as any;
            }
        }
        setDraftObject(initial);
    };

    const handleRemove = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            {title && <p>{title}{suffix}</p>}

            <div className="flex gap-2 items-center mt-1 flex-wrap sm:flex-nowrap">
                {schema ? (
                    (Object.keys(schema) as (keyof T)[]).map((key) => {
                        const field = schema[key];
                        if (field.type === "text") {
                            return (
                                <FormField
                                    error={error}
                                    key={String(key)}
                                    type={field.inputType ?? "text"}
                                    value={(draftObject[key] as string) ?? ""}
                                    onChange={(val) =>
                                        setDraftObject({
                                            ...draftObject,
                                            [key]: val,
                                        })
                                    }
                                    placeholder={field.placeholder}
                                />
                            );
                        }

                        if (field.type === "variant") {
                            return (
                                <VariantPicker
                                    key={String(key)}
                                    options={field.options}
                                    value={
                                        (draftObject[key] as string) ??
                                        field.options[0].value
                                    }
                                    onChange={(val) =>
                                        setDraftObject({
                                            ...draftObject,
                                            [key]: val,
                                        })
                                    }
                                    mode="single"
                                />
                            );
                        }
                        return null;
                    })
                ) : (
                    <FormField
                        value={draftString}
                        error={error}
                        onChange={(value) => setDraftString(value as string)}
                        placeholder={title}
                    />
                )}

                <Button
                    type="button"
                    variant="accent"
                    onClick={handleAdd}
                >
                    <LuPlus />
                </Button>
            </div>

            {items.length > 0 && (
                <ul className="list-disc space-y-1 text-sm">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className={clsx(
                                "flex items-center gap-2 bg-base-100 p-2 rounded-xl transition",
                                errorIndex === i && "animate-pulse bg-base-300"
                            )}
                        >
                            <span className="grow">{renderItem(item)}</span>
                            <Button
                                type="button"
                                onClick={() => handleRemove(i)}
                                variant="error"
                            >
                                <LuTrash />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default EditableList;
