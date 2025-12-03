import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    legend?: string;
    className?: string;
};

const Fieldset = ({ children, legend, className }: Props) => {
    return (
        <fieldset
            className={clsx(
                "fieldset bg-base-200 border-base-300 rounded-box border p-4",
                className
            )}
        >
            <legend className="text-blue-400">{legend}</legend>
            {children}
        </fieldset>
    );
};

export default Fieldset;
