import clsx from "clsx";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface IProps {
    onStateChange?: (state: string) => void;
    value?: string;
    error?: boolean;
}

const DateField = ({ onStateChange, value, error }: IProps) => {
    const [selected, setSelected] = useState<Date | undefined>(
        value ? new Date(value + "T00:00") : undefined
    );
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (value) setSelected(new Date(value + "T00:00"));
    }, [value]);

    return (
        <>
            <button
                type="button"
                popoverTarget="rdp-popover"
                className={clsx(
                    "input input-border cursor-pointer outline-none w-full",
                    error && "border-error"
                )}
                onClick={() => setIsOpen(!isOpen)}
                style={{ anchorName: "--rdp" } as React.CSSProperties}
            >
                {value
                    ? value.split("-").reverse().join(".")
                    : "Выберите дату"}
            </button>

            {isOpen && (
                <div
                    popover="auto"
                    id="rdp-popover"
                    className="dropdown"
                    style={{ positionAnchor: "--rdp" } as React.CSSProperties}
                >
                    <DayPicker
                        className="react-day-picker"
                        mode="single"
                        selected={selected}
                        animate
                        onSelect={(d) => {
                            if (!d) return;
                            setSelected(d);
                            console.log(d);
                            onStateChange?.(d.toISOString().split("T")[0]);
                            setIsOpen(false);
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default DateField;
